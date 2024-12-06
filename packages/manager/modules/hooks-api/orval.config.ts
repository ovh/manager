const suffix = 'OVH';

const config = {
  dummy: {
    output: {
      mode: 'split',
      client: 'react-query',
      mock: false, // Enable it to generate msw
      override: {
        useDeprecatedOperations: false, // Remove depreacted OVH API to enforce using new one
        coerceTypes: true,
        components: {
          schemas: {
            suffix: `${suffix}`,
            itemSuffix: 'Item',
          },
        },
        mutator: {
          path: './custom-instance.ts',
          name: 'customInstanceV6',
        },
      },
    },
    input: {
      override: {
        transformer: (schema) => {
          /*
          console.log({
            me: JSON.stringify(schema.paths['/me/paymentMethod']),
            me2: JSON.stringify(schema.paths['/me/paymentMethod/{id}']),
          }); */

          return schema;
        },
      },
      target: './dist/me.json',
      output: './src/me/me.ts',
    },
  },
};

export default config;
