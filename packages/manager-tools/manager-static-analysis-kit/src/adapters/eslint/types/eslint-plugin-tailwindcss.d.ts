declare module 'eslint-plugin-tailwindcss' {
  const plugin: import('eslint').Linter.Plugin & {
    configs: Record<string, { rules: import('eslint').Linter.RulesRecord }>;
  };
  export = plugin;
}
