package com.example.demo.Plugin;

import org.springframework.stereotype.Component;
import org.springframework.context.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PluginRegistry {
    
    private final Map<String, ImportPluginInterface<?>> plugins = new ConcurrentHashMap<>();
    private final ApplicationContext applicationContext;
    
    @Autowired
    public PluginRegistry(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
        initializePlugins();
    }
    
    /**
     * Plugin'i kayıt eder
     */
    public void registerPlugin(ImportPluginInterface<?> plugin) {
        try {
            plugin.initialize();
            plugins.put(plugin.getName(), plugin);
        } catch (Exception e) {
            throw new RuntimeException("Plugin registration failed: " + plugin.getName(), e);
        }
    }
    
    /**
     * Plugin'i kaldırır
     */
    public void unregisterPlugin(String pluginName) {
        ImportPluginInterface<?> plugin = plugins.get(pluginName);
        if (plugin != null) {
            try {
                plugin.destroy();
                plugins.remove(pluginName);
            } catch (Exception e) {
                // Plugin unregister failed, continue
            }
        }
    }
    
    /**
     * Plugin'i alır
     */
    @SuppressWarnings("unchecked")
    public <T> ImportPluginInterface<T> getPlugin(String name) {
        return (ImportPluginInterface<T>) plugins.get(name);
    }
    
    /**
     * Tüm plugin'leri alır
     */
    public Collection<ImportPluginInterface<?>> getAllPlugins() {
        return plugins.values();
    }
    
    /**
     * Plugin'in kayıtlı olup olmadığını kontrol eder
     */
    public boolean isPluginRegistered(String name) {
        return plugins.containsKey(name);
    }
    
    /**
     * Aktif plugin'leri alır
     */
    public List<ImportPluginInterface<?>> getActivePlugins() {
        return plugins.values().stream()
                .filter(plugin -> plugin.getConfig().isEnabled())
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }
    
    /**
     * Plugin konfigürasyonlarını alır
     */
    public Map<String, PluginConfig> getPluginConfigs() {
        Map<String, PluginConfig> configs = new HashMap<>();
        plugins.forEach((name, plugin) -> {
            configs.put(name, plugin.getConfig());
        });
        return configs;
    }
    
    /**
     * Plugin'leri başlatır
     */
    private void initializePlugins() {
        try {
            // Spring context'ten plugin'leri bul ve kayıt et
            Map<String, ImportPluginInterface> pluginBeans = 
                applicationContext.getBeansOfType(ImportPluginInterface.class);
            
            pluginBeans.values().forEach(this::registerPlugin);
            
        } catch (Exception e) {
            // Plugin initialization failed, continue
        }
    }
    
    /**
     * Plugin istatistiklerini döner
     */
    public PluginStats getStats() {
        int total = plugins.size();
        int active = (int) plugins.values().stream()
                .filter(p -> p.getConfig().isEnabled())
                .count();
        
        return new PluginStats(total, active, total - active);
    }
}

/**
 * Plugin istatistikleri
 */
class PluginStats {
    private final int total;
    private final int active;
    private final int inactive;
    
    public PluginStats(int total, int active, int inactive) {
        this.total = total;
        this.active = active;
        this.inactive = inactive;
    }
    
    public int getTotal() { return total; }
    public int getActive() { return active; }
    public int getInactive() { return inactive; }
}
