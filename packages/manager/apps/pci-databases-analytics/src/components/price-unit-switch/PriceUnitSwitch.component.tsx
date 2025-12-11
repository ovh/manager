import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { cn } from '@/lib/utils';

interface PriceUnitSwitch {
  showMonthly: boolean;
  onChange: (newValue: boolean) => void;
}
const PriceUnitSwitch = ({ showMonthly, onChange }: PriceUnitSwitch) => {
  const { t } = useTranslation('pricing');
  const handleClick = (newValue: boolean) => {
    if (newValue !== showMonthly) {
      onChange(newValue);
    }
  };
  return (
    <div className="grid grid-cols-2 w-full">
      <Button
        data-testid="pricing_button_hourly"
        type="button"
        mode="ghost"
        size="sm"
        onClick={() => handleClick(false)}
        className={cn('font-semibold h-6', {
          'bg-primary-100': !showMonthly,
        })}
      >
        {t('pricing_button_hourly')}
      </Button>
      <Button
        data-testid="pricing_button_monthly"
        type="button"
        mode="ghost"
        size="sm"
        onClick={() => handleClick(true)}
        className={cn('font-semibold h-6', {
          'bg-primary-100': showMonthly,
        })}
      >
        {t('pricing_button_monthly')}
      </Button>
    </div>
  );
};

export default PriceUnitSwitch;
