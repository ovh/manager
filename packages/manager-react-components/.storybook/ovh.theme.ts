import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  // Brand
  colorPrimary: '#004FD6',
  colorSecondary: '#004FD6',

  // UI
  appBg: '#FF3358',
  appBorderColor: '#004FD6',
  appBorderRadius: 0,
  appContentBg: '#ffffff',

  // Typography
  fontBase:
    '"Source Sans Pro", "Trebuchet MS", "Arial", "Segoe UI", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#202124',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barBg: '#f3fcff',
  barSelectedColor: '#004FD6',
  barTextColor: '#202124',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#cccccc',
  inputBorderRadius: 4,
  inputTextColor: '#333333',
});
