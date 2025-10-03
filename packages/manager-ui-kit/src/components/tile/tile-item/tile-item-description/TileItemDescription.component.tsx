import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TileDivider } from '../../tile-divider/TileDivider.component';
import { TileItemDescriptionProps } from './TileItemDescription.props';

export const TileItemDescription = ({
  label,
  children,
  divider = true,
  ...rest
}: TileItemDescriptionProps) => {
  return (
    <dd className="m-0" {...rest}>
      {label && <Text preset={TEXT_PRESET.span}>{label}</Text>}
      {children}
      {divider && <TileDivider />}
    </dd>
  );
};
