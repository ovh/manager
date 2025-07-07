import { Text } from '@ovhcloud/ods-react';
import { WrapComponentProps, WrapPreset } from './Wrap.props';

export const Wrap = ({
  children,
  preset = WrapPreset.title,
  className = '',
  ...props
}: WrapComponentProps) => {
  return (
    <Text preset={preset} className={className} {...props}>
      {children}
    </Text>
  );
};
