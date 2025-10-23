import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { TFlavorTag } from '@/types/instance/common.type';
import FlavorTag from '../FlavorTag.component';

type TFlavorOptionProps = {
  label: string;
  tag?: TFlavorTag;
};

const FlavorSelectOption: FC<TFlavorOptionProps> = ({ label, tag }) => (
  <div className="flex gap-x-6 justify-between items-center">
    <Text>{label}</Text>
    {tag && <FlavorTag tag={tag} />}
  </div>
);

export default FlavorSelectOption;
