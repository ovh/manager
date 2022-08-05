// eslint-disable-next-line prettier/prettier
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import {
  keyframes,
} from "@chakra-ui/react";

const skeleton = keyframes`
  to {background-position: 200% 0}
`;

const Skeleton: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: '.5rem',
    backgroundColor: 'gray.50',
    backgroundImage: 'linear-gradient(-90deg,#f2f2f2,#e6e6e6 46%,#e6e6e6 61%,#f2f2f2)',
    backgroundPosition: '-200% 0',
    backgroundRepeat: 'repeat-y',
    backgroundSize: '50% 12.5rem',
    opacity: 1,
    animation: `${skeleton} 2s linear infinite`,
  },
};

export default Skeleton;
