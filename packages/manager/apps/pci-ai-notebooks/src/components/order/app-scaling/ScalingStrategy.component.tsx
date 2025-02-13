import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Scaling } from '@/types/orderFunnel';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormControl, FormItem } from '@/components/ui/form';
import { AutoScalingForm } from './AutoScalingForm.component';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ScalingStrategyProps {
  scaling: Scaling;
  onChange: (scalingStrat: Scaling) => void;
}

const ScalingStrategy = React.forwardRef<
  HTMLInputElement,
  ScalingStrategyProps
>(({ scaling, onChange }, ref) => {
  const { t } = useTranslation('components/scaling');
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...scaling, replicas: Number(e.target.value) });
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
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
        <AutoScalingForm onChange={onChange} scaling={scaling} ref={ref} />
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
        </>
      )}
      {((!scaling.autoScaling && scaling.replicas > 1) ||
        (scaling.autoScaling && scaling.replicasMin > 1)) && (
        <Alert variant="info" className="pt-4">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('scalingBillingInfo')}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
});

export default ScalingStrategy;
