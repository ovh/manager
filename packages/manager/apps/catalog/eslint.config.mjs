// Full adoption
/*import { eslintSharedConfig } from '@ovh-ux/manager-static-analysis-kit';

export default eslintSharedConfig;
*/

// Progressive adoption
import { a11yEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/a11y';
import {
  complexityJsxTsxConfig,
  complexityTsJsConfig,
} from '@ovh-ux/manager-static-analysis-kit/eslint/complexity';
// import { cssEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/css';
// import { htmlEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/html';
// import { importEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/imports';
import { javascriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/javascript';
// import { checkFileEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/naming-conventions';
// import { prettierEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/prettier';
// import { reactEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/react';
import { tailwindJsxConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tailwind-jsx';
import { tanStackQueryEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tanstack';
import { vitestEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/tests';
import { typescriptEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/typescript';

// import { storybookEslintConfig } from '@ovh-ux/manager-static-analysis-kit/eslint/storybook';

// export default [
//   javascriptEslintConfig,
//   typescriptEslintConfig,
//   reactEslintConfig,
//   a11yEslintConfig,
//   htmlEslintConfig,
//   tailwindJsxConfig,
//   tanStackQueryEslintConfig,
//   ...importEslintConfig,
//   ...checkFileEslintConfig,
//   vitestEslintConfig,
//   prettierEslintConfig,
//   complexityJsxTsxConfig,
//   complexityTsJsConfig,
//   {
//     ...cssEslintConfig,
//     files: ['**\/*.css', '**\/*.scss'],
//   },
// ];*/

// Progressive and disable some rules

export default [
  {
    ...typescriptEslintConfig,
    rules: {
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
  javascriptEslintConfig,
  a11yEslintConfig,
  tailwindJsxConfig,
  tanStackQueryEslintConfig,
  vitestEslintConfig,
  complexityJsxTsxConfig,
  complexityTsJsConfig,
];

