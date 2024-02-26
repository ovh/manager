import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatStorage } from '@/lib/bytesHelper';
import { database } from '@/models/database';

interface StorageConfigProps {
  availability: database.Availability;
  value: number;
  onChange: (newValue: number) => void;
}
const DEFAULT_UNIT = 'GB';
const StorageConfig = React.forwardRef<HTMLInputElement, StorageConfigProps>(
  ({ availability, value, onChange }, ref) => {
    if (!availability.specifications.storage) return <></>;
    const { storage, flavor } = availability.specifications;
    const { minimum, maximum, step } = storage;
    if (maximum.value === 0 || minimum.value === maximum.value || !step) {
      return <></>;
    }
    const minAddable = 0;
    const maxAddable = maximum.value - minimum.value;
    return (
      <div>
        <p>
          Votre modèle de nœud {flavor} inclut {formatStorage(minimum)} de
          stockage auxquels vous pouvez ajouter jusqu'à{' '}
          {formatStorage({ value: maxAddable, unit: DEFAULT_UNIT })} de stockage
          supplémentaire par pas de {formatStorage(step)}.
        </p>
        <Label htmlFor="storage-select">
          Sélectionnez le stockage additionnel du cluster
        </Label>
        <div className="flex flex-col">
          <div className="flex justify-between mb-2">
            <span>Aucun</span>
            <span>
              {formatStorage({
                value: maxAddable,
                unit: DEFAULT_UNIT,
              })}
            </span>
          </div>
          <Slider
            ref={ref}
            onValueChange={([newValue]) => onChange(newValue)}
            id="storage-select"
            name="storage-select"
            defaultValue={[minimum.value]}
            value={[value]}
            min={minAddable}
            max={maxAddable}
            step={step?.value || 1}
          />
          <div className="flex w-full justify-center mt-2">
            <span className="font-bold">
              {formatStorage({
                value,
                unit: DEFAULT_UNIT,
              })}
            </span>
          </div>
        </div>
      </div>
    );
  },
);
StorageConfig.displayName = 'StorageConfig';
export default StorageConfig;
