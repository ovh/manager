import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ComponentWithAs,
  HTMLChakraProps,
  StyleFunctionProps,
  ThemingProps,
  omitThemingProps,
} from '@chakra-ui/system';
// import { callAll, cx } from "@chakra-ui/shared-utils"
import {
  chakra,
  RadioProps,
  CheckboxProps,
  CheckboxGroupProps,
  Box,
  useMultiStyleConfig,
  Checkbox,
  useCheckbox,
  Flex,
  UseCheckboxProps,
  theme,
} from '@chakra-ui/react';
import { callAll, cx } from '@chakra-ui/utils';

import { CheckIcon } from '../../ui-kit/ovh-components';

export type ThumbnailChoiceType = 'radio' | 'checkbox';

export interface ThumbnailChoiceProps
  extends HTMLChakraProps<'div'>,
    ThemingProps<'ThumbnailChoice'> {
  type: ThumbnailChoiceType;
}

export interface ThumbnailCheckboxProps extends CheckboxProps {
  checkboxTitle: JSX.Element | string;
  value?: string;
  description?: string;
  footerText?: string;
}

const CheckboxThumbnailStyleContext = createContext({} as Record<string, any>);

// const CheckboxControl = (props: any) => {
//   const { children, ...rest } = props;
//   const styles = useContext(CheckboxThumbnailStyleContext);

//   const controlStyles = {
//     ...theme.components.Checkbox.baseStyle(props).control,
//     ...styles.control,
//   };

//   return (
//     <chakra.span __css={controlStyles} {...rest}>
//       {children}
//     </chakra.span>
//   );
// };

// export interface ThumbnailCheckboxGroupProps extends CheckboxGroupProps {}

export const ThumbnailCheckbox = (props: ThumbnailCheckboxProps) => {
  // const {
  //   variant,
  //   checkboxTitle,
  //   children,
  //   description,
  //   value,
  //   footerText,
  //   ...rest,
  // } = props;
  // const ownProps = omitThemingProps(props);

  const {
    variant,
    checkboxTitle,
    children,
    description,
    footerText,
    ...rest
  } = props;
  const {
    state,
    getInputProps,
    getLabelProps,
    getCheckboxProps,
    getRootProps,
    htmlProps,
  } = useCheckbox(rest);
  const {
    style,
    'aria-disabled': ard,
    'aria-invalid': ad,
    'aria-label': al,
    'aria-labelledby': alb,
    ...inputProps
  } = getInputProps();
  const container = useRef<any>();

  const styles = useMultiStyleConfig('ThumbnailChoice', { variant });
  return (
    <CheckboxThumbnailStyleContext.Provider value={styles}>
      <Box
        noOfLines={0}
        __css={styles.container}
        {...getRootProps()}
        {...htmlProps}
      >
        <chakra.label cursor="pointer" __css={styles.label} ref={container}>
          <Checkbox
            icon={<CheckIcon />}
            {...state}
            {...inputProps}
            onKeyDown={(e) => (e.key === ' ' ? container.current?.click() : '')}
            __css={styles.checkbox}
          >
            {checkboxTitle}
          </Checkbox>
          <chakra.div {...getLabelProps()} __css={styles.description}>
            {description || children}
          </chakra.div>
        </chakra.label>
        {footerText && (
          <chakra.div __css={styles.footer}>
            <chakra.p>{footerText}</chakra.p>
          </chakra.div>
        )}
      </Box>
    </CheckboxThumbnailStyleContext.Provider>
  );
};

// export const ThumbnailChoice = (props: ThumbnailChoiceProps) => {

//   const { type, ...rest} = props;
//   // return {type === 'checkbox' ? <ThumbnailCheckbox {...rest} />: ''} ;
// };
