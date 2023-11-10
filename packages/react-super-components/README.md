# ⚛️⚡ Vite + React + Typescript Component Library Template

## Features

- ⚛️ [React 18](https://reactjs.org/)
- 📚 [Storybook 7](https://storybook.js.org/) - Components preview
- 🖌️ [Tailwind CSS 3](https://tailwindcss.com/)
- ⏩ [Vite](https://vitejs.dev/) - Run and build the project blazingly fast!
- ⚡ [Vitest](https://vitest.dev/) - Components Unit Testing
- 📐 [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Formatting and Linting
- 🌟 [Typescript](https://www.typescriptlang.org/)
- 🐶 [Husky](https://typicode.github.io/husky) & [Lint Staged](https://www.npmjs.com/package/lint-staged) - Pre-commit Hooks
- ⏰ [Release Please](https://github.com/googleapis/release-please) — Generate the changelog with the release-please workflow
- 👷 [Github Actions](https://github.com/features/actions) — Releasing versions to NPM
- Initial components setup using [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

## Getting Started

1. Create a new repository using this one as template
2. Clone your repo
3. Install dependencies with `pnpm i` (first run `corepack enable` to enable pnpm)
4. Run `pnpm prepare` command to setup [Husky](https://typicode.github.io/husky) pre-commit hooks.

## Main Scripts

Always prepending pnpm:

- `dev`: Bootstrap the Storybook preview with Hot Reload.
- `build`: Builds the static storybook project.
- `build:lib`: Builds the component library into the **dist** folder.
- `lint:fix`: Applies linting based on the rules defined in **.eslintrc.js**.
- `format:prettier`: Formats files using the prettier rules defined in **.prettierrc**.
- `test`: Runs testing using watch mode.
- `test:cov`: Runs testing displaying a coverage report.

## Blog Post

I created a post explaning how to set up this library and publish it to a package registry! You can read it [here](https://igna.hashnode.dev/vite-react-typescript-component-library-template-setup-explanation).

## Author

[Ignacio Miranda Figueroa](https://www.linkedin.com/in/ignacio-miranda-figueroa/)

## License

[MIT](LICENSE)
