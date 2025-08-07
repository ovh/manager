declare module 'eslint-plugin-jsx-a11y' {
  import type { Linter } from 'eslint';
  const plugin: Linter.Plugin & {
    flatConfigs?: {
      recommended?: {
        rules: Linter.RulesRecord;
        languageOptions?: Linter.FlatConfig['languageOptions'];
      };
      strict?: {
        rules: Linter.RulesRecord;
        languageOptions?: Linter.FlatConfig['languageOptions'];
      };
    };
  };
  export default plugin;
}
