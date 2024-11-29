/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */

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

const mergedSchemas: Record<string, Schema> = {};

function mergeSchemas(current: Schema, newSchema: Schema): Schema {
  // Fusion des chemins
  Object.keys(newSchema.paths).forEach((p) => {
    if (!current.paths[p]) {
      current.paths[p] = newSchema.paths[p];
    } else {
      Object.keys(newSchema.paths[p]).forEach((method) => {
        if (!current.paths[p][method]) {
          current.paths[p][method] = newSchema.paths[p][method];
        }
      });
    }
  });

  // Fusion des composants
  Object.keys(newSchema.components.schemas).forEach((model) => {
    if (!current.components.schemas[model]) {
      current.components.schemas[model] = newSchema.components.schemas[model];
    } else {
      if ('enum' in newSchema.components.schemas[model]) {
        newSchema.components.schemas[model].enum.forEach(
          (enumValue: string) => {
            if (!current.components.schemas[model].enum.includes(enumValue)) {
              current.components.schemas[model].enum.push(enumValue);
            }
          },
        );
      }
    }
  });
  return current;
}

function cleanSchemas(section: string, schema: Schema): Schema {
  Object.keys(schema.paths).forEach((p) => {
    Object.keys(schema.paths[p]).forEach((method) => {
      delete schema.paths[p][method]['x-code-samples'];
    });
  });

  if (section === 'telephony') {
    // Also use in BFF, they clean some schema paths not used
    delete schema.paths[
      '/telephony/{billingAccount}/easyHunting/{serviceName}/hunting/queue/{queueId}/agent'
    ]?.post;
    delete schema.paths[
      '/telephony/{billingAccount}/ovhPabx/{serviceName}/hunting/queue/{queueId}/agent'
    ]?.post;
  }

  return schema;
}

async function doTheMerge(outputDir: string) {
  const basePaths = [
    'https://www.ovh.com',
    'https://ca.ovh.com',
    'https://us.ovhcloud.com',
  ];

  const apiPaths: Record<'v1' | 'v2', string> = {
    v1: '/engine/apiv6/',
    v2: '/engine/api/v2',
  };
  await Promise.all(
    basePaths.map(async (basePath) => {
      await Promise.all(
        Object.keys(apiPaths).map(async (version) => {
          const baseUrl = `${basePath}${apiPaths[version as 'v1' | 'v2']}`;
          const regionRootSchema = (await axios.get(baseUrl)).data;

          regionRootSchema.apis.forEach(async (api: { path: string }) => {
            const cleanSectionName = api.path.replace('/', '');
            const bp = baseUrl.replace(/\/$/, '');

            console.log(`=> Fetching ${bp}${api.path}`);
            const apiSchema = cleanSchemas(
              cleanSectionName,
              (await axios.get(`${bp}${api.path}.json?format=openapi3`)).data,
            );
            apiSchema.servers = [];

            Object.keys(apiSchema.paths).forEach((p: string) => {
              Object.keys(apiSchema.paths[p]).forEach((method) => {
                apiSchema.paths[p][method].servers = [{ url: version }];
                if ('tags' in apiSchema.paths[p][method]) {
                  const { tags } = apiSchema.paths[p][method];
                  if (tags.length > 1) {
                    apiSchema.paths[p][method].tags = [tags[0]];
                  }
                }
              });
            });

            if (!mergedSchemas[cleanSectionName]) {
              mergedSchemas[cleanSectionName] = apiSchema;
            } else {
              mergedSchemas[cleanSectionName] = mergeSchemas(
                mergedSchemas[cleanSectionName],
                apiSchema,
              );
            }

            mergedSchemas[cleanSectionName].servers.push({
              url: basePath,
              variables: {
                v1: { default: '/engine/apiv6' },
                v2: { default: '/engine/api/v2' },
              },
            });
          });
        }),
      );
    }),
  );

  Object.keys(mergedSchemas).forEach((section) => {
    const outPath = path.join(outputDir, `${section}.json`);
    const dir = path.dirname(outPath);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Writted file => ${outPath}`);
    fs.writeFileSync(outPath, JSON.stringify(mergedSchemas[section]));
  });
}

// Appel de la fonction principale
doTheMerge('./dist');

// Run the file

// npx ts-node ./generate-schema.ts

// Run the orval command
// npx ./generate-types-and-hooks.ts
// Use orval to generate file npx orval
// https://orval.dev/

// TODO Att the end remove dist folder
