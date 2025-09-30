import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { TFlavorTypeTag } from '@/types/instance/common.type';
import FlavorTypeTag from './FlavorTypeTag.component';

type TFlavorTypeItemProps = {
  label: string;
  tag?: TFlavorTypeTag;
};

const FlavorTypeItem: FC<TFlavorTypeItemProps> = ({ label, tag }) => (
  <div className="flex gap-x-6 justify-between items-center">
    <Text>{label}</Text>
    {tag && <FlavorTypeTag tag={tag} />}
  </div>
);

export default FlavorTypeItem;
