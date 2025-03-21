import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, HelpCircle } from 'lucide-react';
import {
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@datatr-ux/uxlib';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { AutoScalingForm } from './AutoScalingForm.component';
import Price from '@/components/price/Price.component';

interface ScalingStrategyProps {
  scaling: Scaling;
  onChange: (scalingStrat: Scaling) => void;
  onNonValidForm?: (isPending: boolean) => void;
  pricingFlavor?: AppPricing;
}

const ScalingStrategy = React.forwardRef<
  HTMLInputElement,
  ScalingStrategyProps
>(({ scaling, onChange, pricingFlavor, onNonValidForm }, ref) => {
  const { t } = useTranslation('ai-tools/components/scaling');
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...scaling, replicas: Number(e.target.value) });
  };

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
        <Switch
          data-testid="switch-scaling-button"
          type="button"
          className="rounded-xl"
          id="scaling-strat"
          checked={scaling.autoScaling}
          onCheckedChange={(checked: boolean) =>
            onChange({ ...scaling, autoScaling: checked })
          }
        />
        <Label className="font-semibold text-lg">
          {scaling.autoScaling
            ? t('scalingStratActiveLabel')
            : t('noScalingStratActiveLabel')}
        </Label>
      </div>
      {scaling.autoScaling ? (
        <AutoScalingForm
          onChange={onChange}
          scaling={scaling}
          ref={ref}
          pricingFlavor={pricingFlavor}
          onNonValidForm={onNonValidForm}
        />
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
          <Input
            data-testid="replicas-input"
            ref={ref}
            type="number"
            max={10}
            min={1}
            value={scaling.replicas}
            onChange={handleChange}
          />
          {pricingFlavor && (
            <div className="mt-2">
              <Price
                decimals={2}
                displayInHour={true}
                priceInUcents={scaling.replicas * 60 * pricingFlavor.price}
                taxInUcents={scaling.replicas * 60 * pricingFlavor.tax}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default ScalingStrategy;
