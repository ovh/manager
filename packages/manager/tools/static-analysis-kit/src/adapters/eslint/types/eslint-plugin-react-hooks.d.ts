declare module 'eslint-plugin-react-hooks' {
  import { ESLint } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: Record<string, any>;
  };

  export default plugin;
}
