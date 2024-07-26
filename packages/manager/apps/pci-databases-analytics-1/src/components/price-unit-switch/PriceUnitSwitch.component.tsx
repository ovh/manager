import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
        variant="ghost"
        size="sm"
        onClick={() => handleClick(false)}
        className={cn(
          'text-sm font-semibold h-6 text-primary-500 border-2 border-primary-100 rounded-r-none hover:bg-primary-100 hover:border-primary-500',
          {
            'border-primary-500': !showMonthly,
          },
        )}
      >
        {t('pricing_button_hourly')}
      </Button>
      <Button
        data-testid="pricing_button_monthly"
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => handleClick(true)}
        className={cn(
          'text-sm font-semibold h-6 text-primary-500 border-2 border-primary-100 rounded-l-none hover:bg-primary-100 hover:border-primary-500',
          {
            'border-primary-500': showMonthly,
          },
        )}
      >
        {t('pricing_button_monthly')}
      </Button>
    </div>
  );
};

export default PriceUnitSwitch;
