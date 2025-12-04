import React from 'react';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';

import { ScalingFormValues } from '@/lib/scalingHelper';

interface ReplicaFieldsProps {
  control: Control<ScalingFormValues>;
  onFieldChange: () => void;
}

export const ReplicaFields: React.FC<ReplicaFieldsProps> = ({
  control,
  onFieldChange,
}) => {
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <>
      <div className="xl:col-start-1 xl:row-start-1 w-full">
        <FormField
          control={control}
          name="minRep"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm">{t('replicasMinInputLabel')}</p>
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent className="text-sm">
                    <p>{t('haInfoHelper')}</p>
                  </PopoverContent>
                </Popover>
              </div>
              <FormControl>
                <Input
                  data-testid="min-rep-input"
                  {...field}
                  type="number"
                  max={100}
                  min={1}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onFieldChange();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="xl:col-start-1 xl:row-start-2 w-full">
        <FormField
          control={control}
          name="maxRep"
          render={({ field }) => (
            <FormItem>
              <p className="text-sm">{t('replicasMaxInputLabel')}</p>
              <FormControl>
                <Input
                  data-testid="max-rep-input"
                  {...field}
                  type="number"
                  max={100}
                  min={1}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onFieldChange();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
