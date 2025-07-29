export const tsBaseConfig = {
  $schema: 'https://json.schemastore.org/tsconfig',
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    declaration: true,
    declarationMap: true,
    removeComments: true,
    composite: true,
    incremental: true,
    baseUrl: '.',
  },
};
