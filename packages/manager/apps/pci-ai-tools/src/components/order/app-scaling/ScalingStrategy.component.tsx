import { useTranslation } from 'react-i18next';
import {
  useFormContext,
  useWatch,
  ControllerRenderProps,
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
import { AppPricing } from '@/types/orderFunnel';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { AutoScalingForm } from './AutoScalingForm/AutoScalingForm.component';
import Price from '@/components/price/Price.component';
import { ScalingStrategySchema, SCALING_DEFAULTS } from './scalingHelper';

interface ScalingStrategyProps {
  pricingFlavor?: AppPricing;
}

export default function ScalingStrategy({
  pricingFlavor,
}: ScalingStrategyProps) {
  const { t } = useTranslation('ai-tools/components/scaling');
  const locale = useLocale();
  const { control } = useFormContext<ScalingStrategySchema>();

  const autoScaling = useWatch({ control, name: 'autoScaling' });
  const replicas = useWatch({ control, name: 'replicas' });

  const renderAutoScalingField = ({
    field,
  }: {
    field: ControllerRenderProps<ScalingStrategySchema, 'autoScaling'>;
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
    field: ControllerRenderProps<ScalingStrategySchema, 'replicas'>;
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
          max={10}
          min={1}
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
        name="autoScaling"
        render={renderAutoScalingField}
      />
      {autoScaling ? (
        <AutoScalingForm pricingFlavor={pricingFlavor} />
      ) : (
        <div>
          <FormField
            control={control}
            name="replicas"
            render={renderReplicasField}
          />
          {pricingFlavor && (
            <div className="mt-2">
              <Price
                decimals={2}
                displayInHour={true}
                priceInUcents={replicas * 60 * pricingFlavor.price}
                taxInUcents={replicas * 60 * pricingFlavor.tax}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
