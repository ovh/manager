import { FC, useMemo } from 'react';
import { mockedFlavors } from '@/__mocks__/instance/constants';
import { Text } from '@ovhcloud/ods-react';

type TFlavorDetails = {
  quantity: number;
  flavor: string;
};

export const FlavorDetails: FC<TFlavorDetails> = ({ quantity, flavor }) => {
  const selectedFlavor = useMemo(
    () => mockedFlavors.find((item) => item.name === flavor),
    [flavor],
  );

  if (selectedFlavor) {
    return (
      <div className="flex flex-row gap-2">
        <div>
          <Text className="text-[--ods-color-heading]">
            {quantity} {'x'}
          </Text>
        </div>
        <div>
          <Text className="font-semibold text-[--ods-color-heading]">
            {selectedFlavor.name}
          </Text>
          <Text className="font-semibold text-[--ods-color-heading]">
            {selectedFlavor.memory} Go RAM
          </Text>
          <Text className="font-semibold text-[--ods-color-heading]">
            {selectedFlavor.vcore} vCore
          </Text>
        </div>
      </div>
    );
  }

  return (
    <Text preset="heading-6" className="text-[--ods-color-heading]">
      {flavor}
    </Text>
  );
};
