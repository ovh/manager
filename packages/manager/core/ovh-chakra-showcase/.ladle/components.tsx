import { UIKitTheme } from '@ovh-ux/manager-themes';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
const theme = extendTheme(UIKitTheme);

export const Provider = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);
