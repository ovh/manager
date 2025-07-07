import { Text } from '@ovhcloud/ods-react';
import { WrapProps, WrapPreset } from './Wrap.props';

export const Wrap = ({
  children,
  preset = WrapPreset.title,
  className = '',
  ...props
}: WrapProps) => {
  return (
    <Text preset={preset} className={className} {...props}>
      {children}
    </Text>
  );
};
