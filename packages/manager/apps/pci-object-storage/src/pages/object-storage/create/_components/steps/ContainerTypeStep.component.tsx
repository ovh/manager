import {
  RadioGroup,
  RadioTile,
  Separator,
  RadioIndicator,
} from '@datatr-ux/uxlib';
import React from 'react';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';

interface ConatainerTypeStepProps {
  value?: storages.TypeEnum;
  onChange?: (newValue: storages.TypeEnum) => void;
}
const ContainerTypeStep = React.forwardRef<
  HTMLInputElement,
  ConatainerTypeStepProps
>(({ value, onChange }, ref) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const CONTAINER_TYPES: storages.TypeEnum[] = [
    storages.TypeEnum.static,
    storages.TypeEnum.private,
    storages.TypeEnum.public,
  ];
  return (
    <RadioGroup
      data-testid="offer-select-container"
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2"
      value={value}
      onValueChange={onChange}
    >
      {CONTAINER_TYPES.map((type) => (
        <RadioTile data-testid="offer-radio-tile-s3-api" value={type}>
          <div className="flex h-full flex-col">
            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2">
                <RadioIndicator />
                <h5>{t(`containerTypeLabel-${type}`)}</h5>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="text-xs flex-1 flex flex-col">
              {t(`containerTypeDescription-${type}`)}
            </div>
          </div>
        </RadioTile>
      ))}
    </RadioGroup>
  );
});

ContainerTypeStep.displayName = 'ContainerTypeStep';
export default ContainerTypeStep;
