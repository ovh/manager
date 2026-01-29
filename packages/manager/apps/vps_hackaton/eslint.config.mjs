import {
  compose,
  react,
  typescript,
  prettier,
  a11y,
  tailwind,
} from '@ovh-ux/manager-static-analysis-kit/eslint';

export default compose(
  react(),
  typescript(),
  prettier(),
  a11y(),
  tailwind(),
);
