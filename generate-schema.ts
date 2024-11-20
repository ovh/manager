// Importation des modules nécessaires
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

interface Schema {
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
  servers: Array<any>;
}

let mergedSchemas: Record<string, Schema> = {};

function mergeSchemas(current: Schema, newSchema: Schema): Schema {
  // Fusion des chemins
  for (const path in newSchema.paths) {
    if (!current.paths[path]) {
      current.paths[path] = newSchema.paths[path];
    } else {
      for (const method in newSchema.paths[path]) {
        if (!current.paths[path][method]) {
          current.paths[path][method] = newSchema.paths[path][method];
        }
      }
    }
  }

  // Fusion des composants
  for (const model in newSchema.components.schemas) {
    if (!current.components.schemas[model]) {
      current.components.schemas[model] = newSchema.components.schemas[model];
    } else {
      if ('enum' in newSchema.components.schemas[model]) {
        for (const enumValue of newSchema.components.schemas[model]['enum']) {
          if (!current.components.schemas[model]['enum'].includes(enumValue)) {
            current.components.schemas[model]['enum'].push(enumValue);
          }
        }
      }
    }
  }
  return current;
}

function cleanSchemas(section: string, schema: Schema): Schema {
  for (const path in schema.paths) {
    for (const method in schema.paths[path]) {
      delete schema.paths[path][method]['x-code-samples'];
    }
  }

  if (section === 'telephony') {
    delete schema.paths[
      '/telephony/{billingAccount}/easyHunting/{serviceName}/hunting/queue/{queueId}/agent'
    ]['post'];
    delete schema.paths[
      '/telephony/{billingAccount}/ovhPabx/{serviceName}/hunting/queue/{queueId}/agent'
    ]['post'];
  }

  return schema;
}

async function doTheMerge(outputDir: string) {
  const basePaths = [
    'https://www.ovh.com',
    'https://ca.ovh.com',
    'https://us.ovhcloud.com',
  ];
  const apiPaths = {
    v1: '/engine/apiv6/',
    v2: '/engine/api/v2',
  };

  for (const basePath of basePaths) {
    for (const version in apiPaths) {
      console.log({ basePath, apiPaths });
      // @ts-ignore
      const baseUrl = `${basePath}${apiPaths[version as any]}`;
      const regionRootSchema = (await axios.get(baseUrl)).data;

      for (const api of regionRootSchema['apis']) {
        const cleanSectionName = api['path'].replace('/', '').replace('-', '');
        const bp = baseUrl.replace(/\/$/, '');

        console.log(`=> Fetching ${bp}${api['path']}`);
        const apiSchema = cleanSchemas(
          cleanSectionName,
          (await axios.get(`${bp}${api['path']}.json?format=openapi3`)).data,
        );
        apiSchema['servers'] = [];

        for (const path in apiSchema.paths) {
          for (const method in apiSchema.paths[path]) {
            apiSchema.paths[path][method]['servers'] = [{ url: version }];
            if ('tags' in apiSchema.paths[path][method]) {
              const tags = apiSchema.paths[path][method]['tags'];
              if (tags.length > 1) {
                apiSchema.paths[path][method]['tags'] = [tags[0]];
              }
            }
          }
        }

        if (!mergedSchemas[cleanSectionName]) {
          mergedSchemas[cleanSectionName] = apiSchema;
        } else {
          mergedSchemas[cleanSectionName] = mergeSchemas(
            mergedSchemas[cleanSectionName],
            apiSchema,
          );
        }

        mergedSchemas[cleanSectionName]['servers'].push({
          url: basePath,
          variables: {
            v1: { default: '/engine/apiv6' },
            v2: { default: '/engine/api/v2' },
          },
        });
      }
    }
  }

  for (const section in mergedSchemas) {
    const outPath = path.join(outputDir, `${section}.json`);
    const dir = path.dirname(outPath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outPath, JSON.stringify(mergedSchemas[section]));
  }
}

// Appel de la fonction principale
doTheMerge('./dist');

// TODO Att the end remove dist folder
