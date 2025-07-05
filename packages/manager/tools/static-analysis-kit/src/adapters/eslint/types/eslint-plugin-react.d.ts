declare module 'eslint-plugin-react' {
  import { ESLint } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: Record<string, any>;
  };

  export default plugin;
}
