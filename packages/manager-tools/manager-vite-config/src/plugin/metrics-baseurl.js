import { env } from 'process';

/**
 * Vite plugin to transform metrics client baseURL at build time
 * In development: uses '/api/metrics' (proxied)
 * In production: uses the real endpoint directly
 */
export default function metricsBaseUrlPlugin() {
  const isDevelopment = env.NODE_ENV === 'development';
  const productionBaseUrl = 'https://metrics-for-manager.gra.technicalapis.ovh.net/m4m-single-endpoint-proxy/api/v1';  

  return {
    name: 'metrics-baseurl-transform',
    enforce: 'pre',
    transform(code, id) {
      // Only transform the metricsClient.ts file
      if (!id.includes('metricsClient.ts') || !id.includes('observability-to-customer')) {
        return null;
      }

      // Only transform in production builds (skip in development)
      if (isDevelopment) {
        return null;
      }

      // Replace the baseURL in axios.create call with production endpoint
      // Match: baseURL: '/api/metrics',
      const pattern = /baseURL:\s*['"]\/api\/metrics['"]/;
      
      if (pattern.test(code)) {
        return {
          code: code.replace(
            pattern,
            `baseURL: '${productionBaseUrl}'`,
          ),
          map: null, // No source map for this simple replacement
        };
      }

      return null;
    },
  };
}

