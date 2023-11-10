import type { Preview } from '@storybook/react'
import '../src/lib/tailwind/theme.css'
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
