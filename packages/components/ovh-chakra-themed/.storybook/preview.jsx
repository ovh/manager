import { UIKitTheme } from '@ovh-ux/manager-themes';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
const theme = extendTheme(
  UIKitTheme,
);

export const decorators = [(Story) => (
  <ChakraProvider theme={theme}>
    <Story />
  </ChakraProvider>
)]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  chakra: {
    theme,
  }
};
