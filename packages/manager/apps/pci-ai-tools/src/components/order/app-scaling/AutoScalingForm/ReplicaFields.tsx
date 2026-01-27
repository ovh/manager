import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import { ScalingStrategySchema } from '../scalingHelper';

export function ReplicaFields() {
  const { t } = useTranslation('ai-tools/components/scaling');
  const { control } = useFormContext<ScalingStrategySchema>();

  return (
    <>
      <div className="xl:col-start-1 xl:row-start-1 w-full">
        <FormField
          control={control}
          name="replicasMin"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-2">
                <p className="text-sm">{t('replicasMinInputLabel')}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button">
                      <HelpCircle className="size-4" />
                    </button>
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
                  min={0}
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
          name="replicasMax"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm">{t('replicasMaxInputLabel')}</Label>
              <FormControl>
                <Input
                  data-testid="max-rep-input"
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
    </>
  );
}
