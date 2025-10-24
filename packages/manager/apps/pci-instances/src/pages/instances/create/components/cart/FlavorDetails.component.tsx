import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import {
  TFlavorDataForTable,
  TGpuFlavorDataForTable,
} from '../../view-models/flavorsViewModel';

type TFlavorDetails = {
  quantity: number;
  flavor: TFlavorDataForTable | TGpuFlavorDataForTable;
};

export const FlavorDetails: FC<TFlavorDetails> = ({ quantity, flavor }) => {
  return (
    <div className="flex flex-row gap-2">
      <div>
        <Text className="text-[--ods-color-heading]">
          {quantity} {'x'}
        </Text>
      </div>
      <div>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.name}
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.memory} Go RAM
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.vCore} vCore
        </Text>
      </div>
    </div>
  );
};
