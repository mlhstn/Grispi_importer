import { useState, useEffect } from 'react';
import { ImportConfig, loadConfigFromAPI, IMPORT_CONFIG } from '../config/importConfig';
import { pluginManager } from '../plugins/PluginManager';

export interface UseImportConfigReturn {
  config: ImportConfig | null;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
}

/**
 * Import konfigürasyonunu yöneten custom hook
 */
export const useImportConfig = (): UseImportConfigReturn => {
  const [config, setConfig] = useState<ImportConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      // Plugin manager'ı başlat
      await pluginManager.initializeAll();

      // API'den konfigürasyonu yükle
      const apiConfig = await loadConfigFromAPI();
      
      // Plugin'lerden gelen konfigürasyonları merge et
      const pluginConfigs = pluginManager.getImportConfigs();
      
      const mergedConfig: ImportConfig = {
        ...apiConfig,
        importTypes: {
          ...apiConfig.importTypes,
          ...pluginConfigs
        }
      };

      setConfig(mergedConfig);
    } catch (err) {
      console.error('Konfigürasyon yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      
      // Fallback olarak varsayılan konfigürasyonu kullan
      setConfig(IMPORT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await loadConfig();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refreshConfig
  };
};
