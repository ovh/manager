// eslint-disable-next-line prettier/prettier
import type {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
  SystemStyleObject,
} from "@chakra-ui/theme-tools";
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

import { checkboxAnatomy as parts } from "@chakra-ui/anatomy";

const controlBaseStyle: SystemStyleObject = {
  fontSize: 'md',
  lineHeight: 1.5,
  margin: 0,
};

const Checkbox: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    control: controlBaseStyle,
  },
  defaultProps: {
    colorScheme: 'uikit',
  }
}

export default Checkbox;
