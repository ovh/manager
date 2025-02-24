import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AppPricing, Scaling } from '@/types/orderFunnel';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { Input } from '@/components/ui/input';
import { FormControl, FormItem } from '@/components/ui/form';
import { AutoScalingForm } from './AutoScalingForm.component';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const { t } = useTranslation('components/scaling');
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...scaling, replicas: Number(e.target.value) });
  };
  return (
    <div className="flex flex-col gap-4 mb-2">
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
        <>
          <FormItem>
            <div className="flex items-center space-x-2 mb-4">
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

            <FormControl>
              <Input
                ref={ref}
                type="number"
                max={10}
                min={1}
                value={scaling.replicas}
                onChange={handleChange}
              />
            </FormControl>
          </FormItem>
          {pricingFlavor && (
            <div>
              <Price
                decimals={2}
                displayInHour={true}
                priceInUcents={scaling.replicas * 60 * pricingFlavor.price}
                taxInUcents={scaling.replicas * 60 * pricingFlavor.tax}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default ScalingStrategy;
