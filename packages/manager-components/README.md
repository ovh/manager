# ⚛️⚡ Manager Components Library

## Features

Hosts the components used in manager
Keep it as simple as possible

## Add new component

1. Create a new components folder in `src/components`
2. Add your `stories.tsx` file
3. Add your e2e test

## Import component to another project

The component is not builded so you can import directly the component named `Card` from the workspace like this :
`import Card from '@ovhcloud/manager-components'`

## Main Scripts

Always prepending yarn:

- `start`: Run the storybook
- `test:e2e`: Run e2e test using playwright
- `test`: Runs testing using watch mode and coverage
