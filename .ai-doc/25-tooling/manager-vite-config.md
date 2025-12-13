---
title: Manager Vite Config
version: 0.13.4
last_update: 2025-11-21
tags: [vite, build, config, ovhcloud, manager, development, plugins]
ai: true
---

# Manager Vite Config

> **📦 Version:** `@ovh-ux/manager-vite-config@^0.13.4`

## 🧭 Purpose

The **Manager Vite Config** package provides standardized Vite configuration for OVHcloud Manager applications. It includes optimized build settings, development server configuration, and plugins for React applications in the Manager ecosystem.

This package ensures consistent build behavior across all Manager applications, providing optimized development and production configurations with OVHcloud-specific features.

## ⚙️ Context

Manager Vite Config is designed for:
- **Standardized build configuration** for Manager applications
- **Development server setup** with OVHcloud-specific features
- **Plugin integration** for React, SVG, and static assets
- **Proxy configuration** for API development
- **Environment-specific settings** for different deployment targets

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Development workflow** with hot reload and proxy
- **Production builds** with optimization
- **Asset management** and static file handling

## 🔗 References

- [Manager React Core Application](./manager-react-core-application.md)
- [Tailwind CSS](./tailwind-css.md)
- [Vite Documentation](https://vitejs.dev/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "devDependencies": {
    "@ovh-ux/manager-vite-config": "^0.13.4"
  }
}
```

### Basic Configuration

#### Using the Base Config

```javascript
// vite.config.js
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default getBaseConfig({
  // Optional configuration
  isLABEU: false,
  host: 'localhost',
  devLoginUrl: '/auth',
  baseUrl: '/',
  authURL: '/auth/check'
});
```

#### Default Configuration

```javascript
// The base config provides:
const defaultConfig = {
  base: './',                    // Base path for assets
  root: 'src',                   // Source directory
  publicDir: 'public',           // Public assets directory
  clearScreen: false,            // Keep console output
  resolve: {
    alias: {
      '@': 'src'                 // Path alias for imports
    },
    dedupe: [                    // Deduplicate common packages
      'react',
      'react-dom',
      '@tanstack/react-query',
      // ... other common packages
    ]
  },
  define: {
    __VERSION__: process.env.VERSION || 'null'
  },
  plugins: [
    // React SWC plugin
    // OVH dev server plugin
    // Iframe HMR plugin
    // SVG plugin
    // Static copy plugin
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    sourcemap: false
  },
  server: {
    port: 9000,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 9000
    }
  }
};
```

### Environment Configuration

#### Development Environment

```javascript
// vite.config.js
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default getBaseConfig({
  // Development-specific settings
  isLABEU: process.env.LABEU === 'true',
  host: process.env.LABEU_HOST || 'localhost',
  devLoginUrl: '/auth',
  baseUrl: '/',
  authURL: '/auth/check',
  proxy: {
    host: 'api.ovh.com'
  }
});
```

#### LABEU Environment

```javascript
// For LABEU development
export default getBaseConfig({
  isLABEU: true,
  host: 'labeu.ovh.com',
  devLoginUrl: '/auth',
  baseUrl: '/',
  authURL: '/auth/check'
});
```

#### Container App Configuration

```javascript
// For container applications
export default getBaseConfig({
  // Container-specific settings
  base: './',
  // Additional container configuration
});
```

### Plugin Configuration

#### React SWC Plugin

```javascript
// Automatically configured with React SWC
// Provides fast compilation with SWC
const reactConfig = {
  plugins: [
    react() // @vitejs/plugin-react-swc
  ]
};
```

#### SVG Plugin

```javascript
// SVG handling with vite-plugin-svgr
const svgConfig = {
  plugins: [
    svgr({
      include: '**/*.svg'
    })
  ]
};

// Usage in components
import { ReactComponent as Logo } from './logo.svg';
```

#### Static Copy Plugin

```javascript
// Automatic common translations copying
const staticCopyConfig = {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@ovh-ux/manager-common-translations/@ovh-ux',
          dest: 'translations'
        }
      ]
    })
  ]
};
```

### Development Server Features

#### Proxy Configuration

```javascript
// dev.proxy.config.mjs
export default {
  context: '/engine/apiv6',
  target: 'https://api.ovh.com',
  changeOrigin: true,
  secure: true,
  headers: {
    'X-OVH-Application': 'your-app-id'
  }
};
```

#### Authentication Proxy

```javascript
// Automatic authentication handling
const authConfig = {
  '/auth': {
    target: 'https://auth.ovh.com',
    changeOrigin: true
  },
  '/auth/check': {
    target: 'https://auth.ovh.com',
    changeOrigin: true
  }
};
```

#### API Proxy Configuration

```javascript
// Automatic API proxying
const apiConfig = {
  // v6 API proxy
  '/engine/apiv6': {
    target: 'https://api.ovh.com',
    changeOrigin: true,
    secure: true
  },
  // v2 API proxy
  '/engine/api/v2': {
    target: 'https://api.ovh.com',
    changeOrigin: true,
    secure: true
  },
  // aapi proxy (if local2API is enabled)
  '/engine/2api': {
    target: 'https://api.ovh.com',
    changeOrigin: true,
    secure: true
  }
};
```

### Build Configuration

#### Production Build

```javascript
// Production build settings
const buildConfig = {
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    sourcemap: process.env.OVH_VITE_CONFIG_SOURCEMAPS === 'true',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          router: ['react-router-dom']
        }
      }
    }
  }
};
```

#### Environment Variables

```javascript
// Define environment variables
const defineConfig = {
  define: {
    __VERSION__: process.env.VERSION ? `'${process.env.VERSION}'` : 'null',
    __BUILD_DATE__: `'${new Date().toISOString()}'`,
    __ENVIRONMENT__: `'${process.env.NODE_ENV}'`
  }
};
```

### CSS Configuration

#### SCSS Support

```javascript
// SCSS configuration with include paths
const cssConfig = {
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [
          'node_modules',
          'node_modules/@ovh-ux/manager-react-components/src'
        ]
      }
    }
  }
};
```

#### PostCSS Integration

```javascript
// PostCSS configuration for Tailwind
const postcssConfig = {
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
};
```

### Advanced Configuration

#### Custom Plugins

```javascript
// Adding custom plugins
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import customPlugin from './custom-plugin.js';

export default getBaseConfig({
  // Base configuration
}).then(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    customPlugin()
  ]
}));
```

#### Custom Alias

```javascript
// Adding custom path aliases
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import path from 'path';

export default getBaseConfig({
  // Base configuration
}).then(config => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
}));
```

#### Custom Server Configuration

```javascript
// Custom server settings
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default getBaseConfig({
  // Base configuration
}).then(config => ({
  ...config,
  server: {
    ...config.server,
    port: 3000,
    open: true,
    cors: true
  }
}));
```

### Container App Integration

#### Container Development

```javascript
// For container applications
export default getBaseConfig({
  // Container-specific configuration
  base: './',
  server: {
    port: 9000,
    hmr: {
      port: 9000
    }
  }
});
```

#### µApp Development

```javascript
// For µApp development
export default getBaseConfig({
  // µApp-specific configuration
  base: '/app/',
  server: {
    port: 9001,
    hmr: {
      port: 9001
    }
  }
});
```

### Best Practices

#### 1. Environment Configuration

```javascript
// ✅ CORRECT: Proper environment configuration
export default getBaseConfig({
  isLABEU: process.env.LABEU === 'true',
  host: process.env.LABEU_HOST || 'localhost',
  devLoginUrl: '/auth',
  baseUrl: '/',
  authURL: '/auth/check'
});

// ❌ WRONG: Hardcoded configuration
export default getBaseConfig({
  isLABEU: true,
  host: 'localhost'
});
```

#### 2. Proxy Configuration

```javascript
// ✅ CORRECT: Proper proxy configuration
// dev.proxy.config.mjs
export default {
  context: '/engine/apiv6',
  target: 'https://api.ovh.com',
  changeOrigin: true,
  secure: true,
  headers: {
    'X-OVH-Application': process.env.APP_ID
  }
};

// ❌ WRONG: No proxy configuration
// Missing dev.proxy.config.mjs
```

#### 3. Build Optimization

```javascript
// ✅ CORRECT: Optimized build configuration
export default getBaseConfig({
  // Base configuration
}).then(config => ({
  ...config,
  build: {
    ...config.build,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query']
        }
      }
    }
  }
}));

// ❌ WRONG: No build optimization
export default getBaseConfig();
```

### Common Pitfalls

#### ❌ Wrong: Missing Environment Variables

```javascript
// Don't forget to set environment variables
export default getBaseConfig({
  isLABEU: true,
  host: undefined // Will cause errors
});
```

#### ✅ Correct: Proper Environment Handling

```javascript
export default getBaseConfig({
  isLABEU: process.env.LABEU === 'true',
  host: process.env.LABEU_HOST || 'localhost'
});
```

#### ❌ Wrong: Missing Proxy Configuration

```javascript
// Don't forget proxy configuration for API development
// Missing dev.proxy.config.mjs
```

#### ✅ Correct: Complete Proxy Setup

```javascript
// dev.proxy.config.mjs
export default {
  context: '/engine/apiv6',
  target: 'https://api.ovh.com',
  changeOrigin: true,
  secure: true
};
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use getBaseConfig**: Use the base configuration as starting point
2. **Configure environment variables**: Set up proper environment handling
3. **Set up proxy configuration**: Create dev.proxy.config.mjs for API development
4. **Handle container vs µApp**: Use appropriate base path and port configuration
5. **Optimize build settings**: Configure manual chunks and sourcemaps
6. **Use proper aliases**: Set up path aliases for clean imports
7. **Configure CSS preprocessing**: Set up SCSS and PostCSS properly
8. **Handle static assets**: Configure static file copying

### Configuration Checklist

- [ ] getBaseConfig imported and used
- [ ] Environment variables configured
- [ ] Proxy configuration set up
- [ ] Build optimization configured
- [ ] CSS preprocessing enabled
- [ ] Path aliases configured
- [ ] Static assets handled
- [ ] Development server configured

### Development Setup Checklist

- [ ] dev.proxy.config.mjs created
- [ ] Environment variables set
- [ ] Authentication proxy configured
- [ ] API proxy configured
- [ ] HMR working correctly
- [ ] Hot reload functional
- [ ] Console output clear

### Production Build Checklist

- [ ] Build output optimized
- [ ] Sourcemaps configured
- [ ] Manual chunks defined
- [ ] Static assets copied
- [ ] Environment variables defined
- [ ] Minification enabled
- [ ] Output directory configured

---

## ⚖️ The Build Config's Moral

- **Standardized configuration** ensures consistent build behavior across all applications
- **Development features** provide efficient development workflow with hot reload and proxy// ✅ Bon : Page listing comme home
<Route index Component={ListingPage} />

// ❌ Éviter : SmartRedirect complexe
<Route index element={<SmartRedirectPage />} />
- **Production optimization** ensures fast and efficient production builds
- **Environment handling** enables flexible deployment across different environments

**👉 Good build configuration is invisible to developers but essential for efficient development and deployment.**
