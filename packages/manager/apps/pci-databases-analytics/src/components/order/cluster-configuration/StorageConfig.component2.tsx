import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioTile,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
} from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';
import { formatStorage } from '@/lib/bytesHelper';
import * as database from '@/types/cloud/project/database';

interface StorageConfigProps {
  availability: database.Availability;
  value: number;
  storageMode: database.capabilities.engine.storage.StrategyEnum;
  onChange: (newValue: number) => void;
}
const DEFAULT_UNIT = 'GB';
const StorageConfig2 = React.forwardRef<HTMLInputElement, StorageConfigProps>(
  ({ storageMode, availability, value, onChange }, ref) => {
    const [storageType, setStoageType] = useState('highspeedgen2');
    const { t } = useTranslation('pci-databases-analytics/components/cluster');
    if (!availability.specifications.storage) return <></>;
    const { storage, flavor } = availability.specifications;
    const { minimum, maximum, step } = storage;
    if (maximum.value === 0 || minimum.value === maximum.value || !step) {
      return <></>;
    }
    const minAddable = 0;
    const maxAddable = maximum.value - minimum.value;

    const totalStorage = minimum.value + value;
    const IOPS =
      storageType === 'highspeed' ? 3000 : Math.min(20000, 30 * totalStorage);
    const throughput = storageType === 'highspeed' ? -1 : totalStorage;
    return (
      <div data-testid="storage-configuration-container">
        <div className="py-2">
          {/* <Select defaultValue="highspeedgen2" value={storageType} onValueChange={setStoageType}>
            <SelectTrigger>
              <SelectValue placeholder="type de stockage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highspeed">High speed</SelectItem>
              <SelectItem value="highspeedgen2">High speed gen2</SelectItem>
            </SelectContent>
          </Select> */}

          {/* <b>Type de stockage :</b> */}
          <RadioGroup
            className="mb-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-2"
            defaultValue="highspeedgen2"
            value={storageType}
            onValueChange={setStoageType}
          >
            <RadioTile value={'highspeed'} disabled className="text-left">
              <h5 className="capitalize">High speed</h5>
              <Separator className="my-2" />
              <p className="text-sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Cupiditate esse non consectetur modi tenetur.
              </p>
            </RadioTile>
            <RadioTile value={'highspeedgen2'} className="text-left">
              <h5 className="capitalize">High speed Gen2</h5>
              <Separator className="my-2" />
              <p className="text-sm">
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Et qui consequuntur minus veniam atque.
              </p>
            </RadioTile>
          </RadioGroup>
          {/* <p>
            {t('storageFlavorDescription', {
              flavor,
              includedStorage: formatStorage(minimum),
              maxAdditionalStorage: formatStorage({
                value: maxAddable,
                unit: DEFAULT_UNIT,
              }),
              step: formatStorage(step),
            })}
          </p> */}
          <p className="flex gap-2 mt-2">
            <b>Mode de stockage : </b>
            <span>{storageMode}</span>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
                <PopoverContent>
                  Lorem ipsum, dolor sit amet consectetur adipisicing.
                </PopoverContent>
              </PopoverTrigger>
            </Popover>
          </p>
          <p className="flex gap-2">
            <b>IOPS: </b>
            <span>{IOPS}</span>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
                <PopoverContent>
                  Lorem ipsum, dolor sit amet consectetur adipisicing.
                </PopoverContent>
              </PopoverTrigger>
            </Popover>
          </p>
          <p className="flex gap-2">
            <b>Throughput: </b>
            <span>{throughput === -1 ? '-' : `${throughput} GB/s`}</span>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
                <PopoverContent>
                  Lorem ipsum, dolor sit amet consectetur adipisicing.
                </PopoverContent>
              </PopoverTrigger>
            </Popover>
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span>
              {formatStorage({
                value: minimum.value,
                unit: DEFAULT_UNIT,
              })}
            </span>
            <span>
              {formatStorage({
                value: maximum.value,
                unit: DEFAULT_UNIT,
              })}
            </span>
          </div>
          <Slider
            ref={ref}
            data-testid="storage-slider"
            onValueChange={([newValue]) => onChange(newValue)}
            id="storage-select"
            name="storage-select"
            defaultValue={[minimum.value]}
            value={[value]}
            min={minAddable}
            max={maxAddable}
            step={step?.value || 1}
          />
          <div
            data-testid="storage-unit-value-container"
            className="flex w-full justify-center mt-2"
          >
            <span className="font-bold">
              {formatStorage({
                value: minimum.value + value,
                unit: DEFAULT_UNIT,
              })}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
StorageConfig2.displayName = 'StorageConfig2';
export default StorageConfig2;
