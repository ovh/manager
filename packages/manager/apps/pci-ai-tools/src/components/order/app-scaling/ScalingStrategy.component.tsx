import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, HelpCircle } from 'lucide-react';
import {
  FormField,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@datatr-ux/uxlib';
import { useFormContext } from 'react-hook-form';
import { AppPricing } from '@/types/orderFunnel';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { AutoScalingInputs } from './AutoScalingForm/AutoScalingForm.component';
import Price from '@/components/price/Price.component';
import { ScalingStrategySchema } from './AutoScalingForm/AutoScaling.schema';

interface ScalingStrategyProps {
  pricingFlavor?: AppPricing;
}

const ScalingStrategy = React.forwardRef<
  HTMLInputElement,
  ScalingStrategyProps
>(({ pricingFlavor }, ref) => {
  const form = useFormContext<ScalingStrategySchema>();
  const { t } = useTranslation('ai-tools/components/scaling');
  const locale = useLocale();

  const autoscaling: boolean = form.watch('scaling.autoScaling');
  const replicas: number = form.watch('scaling.replicas');

  return (
    <div
      data-testid="scaling-strat-container"
      className="flex flex-col gap-4 mb-2"
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
      <div className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name="scaling.autoScaling"
          render={({ field }) => (
            <>
              <Switch
                data-testid="switch-scaling-button"
                type="button"
                className="rounded-xl"
                id="scaling-strat"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label className="font-semibold text-lg">
                {field.value
                  ? t('scalingStratActiveLabel')
                  : t('noScalingStratActiveLabel')}
              </Label>
            </>
          )}
        />
      </div>
      {autoscaling ? (
        <AutoScalingInputs pricingFlavor={pricingFlavor} />
      ) : (
        <div>
          <div
            data-testid="fixed-scaling-container"
            className="flex items-center space-x-2 mb-2"
          >
            <p className="text-sm">{t('replicasInputLabel')}</p>
            <Popover>
              <PopoverTrigger>
                <HelpCircle className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                <p>{t('haInfoHelper')}</p>
              </PopoverContent>
            </Popover>
          </div>
          <FormField
            control={form.control}
            name="scaling.replicas"
            render={({ field }) => (
              <Input
                data-testid="replicas-input"
                type="number"
                max={10}
                min={1}
                {...field}
              />
            )}
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
});

ScalingStrategy.displayName = 'ScalingStrategy';

export default ScalingStrategy;
