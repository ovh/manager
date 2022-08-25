import {
  Box,
  chakra,
  omitThemingProps,
  RadioProps,
  useMultiStyleConfig,
  useRadio,
  useRadioGroupContext,
  forwardRef,
} from '@chakra-ui/react';
import { callAll, split } from '@chakra-ui/utils';
import React from 'react';

export interface ThumbnailRadioProps extends RadioProps {
  radioTitle: JSX.Element | string;
  value?: string;
  description?: string;
  footerText?: string;
}

export const ThumbnailRadio = forwardRef<ThumbnailRadioProps, 'input'>(
  (props, ref) => {
    const group = useRadioGroupContext();
    const {
      radioTitle,
      description,
      footerText,
      variant,
      onChange: onChangeProp,
      value: valueProp,
      ...rest
    } = props;
    const styles = useMultiStyleConfig('ThumbnailChoice', { variant });

    const ownProps = omitThemingProps(rest);
    const {
      children,
      isDisabled = group?.isDisabled,
      isFocusable = group?.isFocusable,
      inputProps: htmlInputProps,
      ...radioProps
    } = ownProps;

    let { isChecked } = props;
    if (group?.value != null && valueProp != null) {
      isChecked = group.value === valueProp;
    }

    const name = props?.name ?? group?.name;

    const {
      getInputProps,
      getCheckboxProps,
      getLabelProps,
      getRootProps,
    } = useRadio({
      value: valueProp,
      isChecked,
      isFocusable,
      isDisabled,
      onChange: group?.onChange || onChangeProp,
      name,
      ...radioProps,
    });

    const inputProps = getInputProps(htmlInputProps, ref);

    return (
      <chakra.label
        {...getRootProps()}
        __css={styles.container}
        display="block"
        paddingTop={0}
        {...getCheckboxProps(props)}
      >
        <input {...inputProps} hidden />

        <Box margin={6}>
          <chakra.p {...getLabelProps()} __css={styles.label} margin={0}>
            {radioTitle}
          </chakra.p>
          <chakra.div
            __css={styles.description}
            padding="0"
            marginInlineStart="0"
          >
            {description || children}
          </chakra.div>
        </Box>
        {footerText && (
          <chakra.div __css={styles.footer}>
            <chakra.p>{footerText}</chakra.p>
          </chakra.div>
        )}
      </chakra.label>
    );
  },
);
