import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
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

import { ScalingStrategySchema } from './AutoScaling.schema';

export const ReplicaFields = () => {
  const { control } = useFormContext<ScalingStrategySchema>();
  const { t } = useTranslation('ai-tools/components/scaling');

  return (
    <>
      <div className="xl:col-start-1 xl:row-start-1 w-full">
        <FormField
          control={control}
          name="scaling.replicasMin"
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
          name="scaling.replicasMax"
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
