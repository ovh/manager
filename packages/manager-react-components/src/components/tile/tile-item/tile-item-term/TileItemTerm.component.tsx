import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TileItemTermProps } from './TileItemTerm.props';

export const TileItemTerm = ({
  label,
  actions,
  ...rest
}: TileItemTermProps) => {
  return (
    <dt className="flex justify-between" {...rest}>
      <Text preset={TEXT_PRESET.label} className="font-bold">
        {label}
      </Text>
      {actions && actions}
    </dt>
  );
};
