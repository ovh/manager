/**
 * Vite plugin to fix module resolution for packages with extensionless ESM imports
 * This is a workaround for packages that use extensionless imports which Vitest can't resolve
 */
import fs from 'fs';
import path from 'path';

export default function fixExtensionlessImportsPlugin() {
  return {
    name: 'fix-extensionless-imports',
    enforce: 'pre', // Run before other plugins
    resolveId(source, importer) {
      // Fix extensionless imports in problematic packages
      if (importer && importer.includes('node_modules')) {
        const problematicPackages = [
          '@ovh-ux/manager-react-shell-client',
          '@ovh-ux/request-tagger',
          'ovh-shell',
          '@ovh-ux/shell',
        ];

        const isProblematic = problematicPackages.some((pkg) => importer.includes(pkg));

        if (isProblematic && source.startsWith('./') && !source.endsWith('.js')) {
          const importerDir = path.dirname(importer);
          const resolvedPath = path.resolve(importerDir, source);

          // Check if it's a file
          if (fs.existsSync(`${resolvedPath}.js`)) {
            return `${resolvedPath}.js`;
          }

          // Check if it's a directory with index.js
          if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
            const indexPath = path.join(resolvedPath, 'index.js');
            if (fs.existsSync(indexPath)) {
              return indexPath;
            }
          }
        }
      }
      return null;
    },
    load(id) {
      // Transform file content to fix extensionless imports
      const problematicPackages = [
        '@ovh-ux/manager-react-shell-client',
        '@ovh-ux/request-tagger',
        'ovh-shell',
        '@ovh-ux/shell',
      ];

      const shouldProcess =
        id.includes('/dist/') &&
        id.endsWith('.js') &&
        !id.includes('.bak') &&
        (id.includes('node_modules') || id.includes('packages/')) &&
        problematicPackages.some((pkg) => id.includes(pkg));

      if (shouldProcess) {
        try {
          if (fs.existsSync(id)) {
            let content = fs.readFileSync(id, 'utf-8');
            let modified = false;

            // Fix relative imports: from './module' -> from './module.js'
            content = content.replace(
              /from\s+['"]\.\/([^'"]+?)['"]/g,
              (match, moduleName) => {
                if (/\.(js|mjs|ts|json)$/.test(moduleName)) {
                  return match;
                }
                const dirPath = path.resolve(path.dirname(id), moduleName);
                if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
                  const indexPath = path.join(dirPath, 'index.js');
                  if (fs.existsSync(indexPath)) {
                    modified = true;
                    return match.replace(`./${moduleName}`, `./${moduleName}/index.js`);
                  }
                }
                modified = true;
                return match.replace(`./${moduleName}`, `./${moduleName}.js`);
              },
            );

            // Fix relative imports: from '../module' -> from '../module.js'
            content = content.replace(
              /from\s+['"]\.\.\/([^'"]+?)['"]/g,
              (match, moduleName) => {
                if (/\.(js|mjs|ts|json)$/.test(moduleName)) {
                  return match;
                }
                const dirPath = path.resolve(path.dirname(id), '..', moduleName);
                if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
                  const indexPath = path.join(dirPath, 'index.js');
                  if (fs.existsSync(indexPath)) {
                    modified = true;
                    return match.replace(`../${moduleName}`, `../${moduleName}/index.js`);
                  }
                }
                modified = true;
                return match.replace(`../${moduleName}`, `../${moduleName}.js`);
              },
            );

            if (modified) {
              return content;
            }
          }
        } catch (error) {
          // Silently fail
        }
      }
      return null;
    },
  };
}

