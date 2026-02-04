/**
 * Vite plugin to fix module resolution for @ovh-ux/manager-react-shell-client
 * The package's index.js uses extensionless imports which Vitest can't resolve
 */
export default function fixShellClientPlugin() {
  return {
    name: 'fix-shell-client',
    load(id) {
      // Transform the index.js file to add .js extensions to imports
      if (id.includes('@ovh-ux/manager-react-shell-client/dist/index.js')) {
        // Read the file and transform it
        const fs = require('fs');
        const path = require('path');
        const filePath = id;
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf-8');
          // Replace extensionless imports with .js extensions
          content = content.replace(/from ['"]\.\/([^'"]+)['"]/g, (match, moduleName) => {
            if (!moduleName.endsWith('.js')) {
              return match.replace(`./${moduleName}`, `./${moduleName}.js`);
            }
            return match;
          });
          return content;
        }
      }
      return null;
    },
  };
}

