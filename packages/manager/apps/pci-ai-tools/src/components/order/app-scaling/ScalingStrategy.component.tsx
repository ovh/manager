import { useTranslation } from 'react-i18next';
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { ExternalLink, HelpCircle } from 'lucide-react';
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
  Switch,
} from '@datatr-ux/uxlib';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { AutoScalingForm } from './AutoScalingForm/AutoScalingForm.component';
import {
  SCALING_CONSTRAINTS,
  ScalingStrategySchema,
} from './scalingHelper';

interface ScalingStrategyProps<
  TFieldValues extends FieldValues & ScalingStrategySchema,
> {
  autoScaling?: boolean;
  averageUsageTarget: number;
  control: Control<TFieldValues>;
  isCustom: boolean;
  syncReplicasMaxFromMin: (replicasMinValue?: unknown) => void;
  showScaleToZero: boolean;
}

export default function ScalingStrategy<
  TFieldValues extends FieldValues & ScalingStrategySchema,
>({
  autoScaling,
  averageUsageTarget,
  control,
  isCustom,
  syncReplicasMaxFromMin,
  showScaleToZero,
}: ScalingStrategyProps<TFieldValues>) {
  const { t } = useTranslation('ai-tools/components/scaling');
  const locale = useLocale();

  const renderAutoScalingField = ({
    field,
  }: {
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  }) => (
    <FormItem>
      <div className="flex items-center space-x-2">
        <FormControl>
          <Switch
            data-testid="switch-scaling-button"
            className="rounded-xl"
            id="scaling-strat"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </FormControl>
        <Label className="font-semibold text-lg">
          {field.value
            ? t('scalingStratActiveLabel')
            : t('noScalingStratActiveLabel')}
        </Label>
      </div>
    </FormItem>
  );

  const renderReplicasField = ({
    field,
  }: {
    field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
  }) => (
    <FormItem>
      <div
        data-testid="fixed-scaling-container"
        className="flex items-center space-x-2 mb-2"
      >
        <p className="text-sm">{t('replicasInputLabel')}</p>
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
          data-testid="replicas-input"
          {...field}
          type="number"
          max={SCALING_CONSTRAINTS.FIXED_REPLICAS.MAX}
          min={SCALING_CONSTRAINTS.FIXED_REPLICAS.MIN}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <div
      data-testid="scaling-strat-container"
      className="flex flex-col gap-4 mb-2 px-2"
    >
      <div className="mx-2 text-sm">
        <p>{t('fieldScalingDesc1')}</p>
        <A
          href={getGuideUrl(GUIDES.HOW_TO_MANAGE_SCALING, locale)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="inline-flex items-center gap-2">
            <span>{t('scalingLink')}</span>
            <ExternalLink className="size-4" />
          </div>
        </A>
      </div>
      <FormField
        control={control}
        name={'autoScaling' as FieldPath<TFieldValues>}
        render={renderAutoScalingField}
      />
      {autoScaling ? (
        <AutoScalingForm
          averageUsageTarget={averageUsageTarget}
          control={control}
          isCustom={isCustom}
          syncReplicasMaxFromMin={syncReplicasMaxFromMin}
          showScaleToZero={showScaleToZero}
        />
      ) : (
        <FormField
          control={control}
          name={'replicas' as FieldPath<TFieldValues>}
          render={renderReplicasField}
        />
      )}
    </div>
  );
}
