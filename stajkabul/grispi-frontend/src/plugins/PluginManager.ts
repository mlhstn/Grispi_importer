import { ImportTypeConfig } from '../config/importConfig';

export interface ImportPlugin {
  name: string;
  version: string;
  config: ImportTypeConfig;
  
  // Plugin lifecycle hooks
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  
  // Custom validation logic
  validateRow?(row: Record<string, any>): Promise<ValidationResult>;
  
  // Custom transformation logic
  transformData?(data: any[]): Promise<any[]>;
  
  // Custom UI components
  getCustomComponents?(): Record<string, React.ComponentType>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export class PluginManager {
  private plugins: Map<string, ImportPlugin> = new Map();
  private initialized: boolean = false;
  
  /**
   * Plugin'i kayıt eder
   */
  async registerPlugin(plugin: ImportPlugin): Promise<void> {
    try {
      await plugin.initialize();
      this.plugins.set(plugin.name, plugin);
      console.log(`Plugin registered: ${plugin.name} v${plugin.version}`);
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.name}:`, error);
      throw error;
    }
  }
  
  /**
   * Plugin'i kaldırır
   */
  async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      try {
        await plugin.destroy();
        this.plugins.delete(pluginName);
        console.log(`Plugin unregistered: ${pluginName}`);
      } catch (error) {
        console.error(`Failed to unregister plugin ${pluginName}:`, error);
      }
    }
  }
  
  /**
   * Tüm plugin'leri başlatır
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) return;
    
    // Core plugins'leri yükle
    await this.loadCorePlugins();
    
    // External plugins'leri yükle
    await this.loadExternalPlugins();
    
    this.initialized = true;
  }
  
  /**
   * Plugin'i alır
   */
  getPlugin(name: string): ImportPlugin | undefined {
    return this.plugins.get(name);
  }
  
  /**
   * Tüm plugin'leri alır
   */
  getAllPlugins(): ImportPlugin[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Plugin'in import konfigürasyonunu alır
   */
  getImportConfigs(): Record<string, ImportTypeConfig> {
    const configs: Record<string, ImportTypeConfig> = {};
    
    this.plugins.forEach((plugin) => {
      configs[plugin.config.name] = plugin.config;
    });
    
    return configs;
  }
  
  /**
   * Core plugin'leri yükler
   */
  private async loadCorePlugins(): Promise<void> {
    // Contact Plugin
    const contactPlugin = await import('./core/ContactPlugin');
    await this.registerPlugin(new contactPlugin.default());
    
    // Ticket Plugin
    const ticketPlugin = await import('./core/TicketPlugin');
    await this.registerPlugin(new ticketPlugin.default());
    
    // Organization Plugin
    const organizationPlugin = await import('./core/OrganizationPlugin');
    await this.registerPlugin(new organizationPlugin.default());
  }
  
  /**
   * External plugin'leri yükler
   */
  private async loadExternalPlugins(): Promise<void> {
    try {
      // Plugin konfigürasyonunu API'den al
      const response = await fetch('/api/plugins/list');
      const externalPlugins = await response.json();
      
      for (const pluginInfo of externalPlugins) {
        try {
          // Plugin'i dinamik olarak yükle
          const pluginModule = await import(`./external/${pluginInfo.path}`);
          await this.registerPlugin(new pluginModule.default());
        } catch (error) {
          console.warn(`Failed to load external plugin ${pluginInfo.name}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to load external plugins:', error);
    }
  }
}

// Singleton instance
export const pluginManager = new PluginManager();
