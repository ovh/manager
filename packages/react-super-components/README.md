# ⚛️⚡ React Super component Library

## Features

Handle all React component use in manager
Keep it as simple as possible

## Add new component

1. Create a new components foler in `src/components`
2. Add your `stories.tsx` file
3. Add your e2e test

## Import component to another project

The react super component is not builded so you can import directly selected components
Just update your `tsconfig.json` :
`         "@react-sc/*": [
        "../../../react-super-components/src/components/"
      ]
    `

And import like this :
`import ScTile from '@react-sc/msc-tile'`

## Main Scripts

Always prepending yarn:

- `start`: Run the storybook
- `test:e2e`: Run e2e test using playwright
- `test`: Runs testing using watch mode and coverage
