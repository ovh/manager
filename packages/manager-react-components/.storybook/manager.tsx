import { addons } from '@storybook/manager-api';
import theme from './ovh.theme';

addons.setConfig({
  theme,
  enableShortcuts: false,
  showToolbar: true,
  sidebar: {
    filters: {
      patterns: (item: any) => {
        return !item.tags.includes('isHidden');
      },
    },
  },
});
