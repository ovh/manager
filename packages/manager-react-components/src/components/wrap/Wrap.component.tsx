import { Text } from '@ovhcloud/ods-react';
import { WrapComponentProps, WrapPreset } from './Wrap.props';

const Wrap = ({
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

export default Wrap;
