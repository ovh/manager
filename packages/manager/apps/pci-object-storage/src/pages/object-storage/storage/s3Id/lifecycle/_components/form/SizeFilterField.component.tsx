import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { LifecycleFormValues } from './useLifecycleForm.hook';

type SizeUnit = 'KB' | 'MB' | 'GB';

const SIZE_UNIT_KEYS: SizeUnit[] = ['KB', 'MB', 'GB'];

const SIZE_UNITS: Record<SizeUnit, number> = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

const deriveBestUnit = (bytes: number): { value: number; unit: SizeUnit } => {
  if (bytes <= 0) return { value: 0, unit: 'KB' };

  const units: SizeUnit[] = ['GB', 'MB', 'KB'];
  for (const unit of units) {
    const multiplier = SIZE_UNITS[unit];
    if (bytes >= multiplier && bytes % multiplier === 0) {
      return { value: bytes / multiplier, unit };
    }
  }
  return { value: bytes / SIZE_UNITS.KB, unit: 'KB' };
};

interface SizeFilterFieldProps {
  name: 'objectSizeGreaterThan' | 'objectSizeLessThan';
  label: string;
  form: UseFormReturn<LifecycleFormValues>;
  isPending: boolean;
}

export const SizeFilterField = ({
  name,
  label,
  form,
  isPending,
}: SizeFilterFieldProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');
  const initialBytes = form.getValues(name) as number;

  const [unit, setUnit] = useState<SizeUnit>(
    () => deriveBestUnit(initialBytes).unit,
  );
  const [inputValue, setInputValue] = useState<number>(
    () => deriveBestUnit(initialBytes).value,
  );

  const derivedBytes = Math.round(inputValue * SIZE_UNITS[unit]);

  const updateForm = (value: number, selectedUnit: SizeUnit) => {
    const newBytes = Math.round(value * SIZE_UNITS[selectedUnit]);
    form.setValue(name, newBytes >= 0 ? newBytes : 0, {
      shouldValidate: true,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputValue(value);
    updateForm(value, unit);
  };

  const handleUnitChange = (newUnit: SizeUnit) => {
    setUnit(newUnit);
    updateForm(inputValue, newUnit);
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {derivedBytes > 0 && (
        <p className="text-xs text-muted-foreground mb-1">
          {t('formObjectSizeBytesDisplay', { bytes: derivedBytes })}
        </p>
      )}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input
            type="number"
            min={0}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isPending}
          />
        </div>
        <div className="flex-1">
          <Select value={unit} onValueChange={handleUnitChange} disabled={isPending}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_UNIT_KEYS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
