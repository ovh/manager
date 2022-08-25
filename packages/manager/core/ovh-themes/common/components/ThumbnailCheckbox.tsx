import React, { createContext, useRef } from 'react';
import { HTMLChakraProps, ThemingProps } from '@chakra-ui/system';
import {
  chakra,
  CheckboxProps,
  Box,
  useMultiStyleConfig,
  Checkbox,
  useCheckbox,
} from '@chakra-ui/react';

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

export const ThumbnailCheckbox = (props: ThumbnailCheckboxProps) => {
  const {
    variant,
    checkboxTitle,
    children,
    description,
    footerText,
    icon,
    ...rest
  } = props;
  const {
    state,
    getInputProps,
    getLabelProps,
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
            icon={icon || <CheckIcon />}
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
