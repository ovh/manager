import { Popover, PopoverContent, PopoverTrigger } from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Position = 'left' | 'top' | 'right' | 'bottom';

interface FreeBetaPricingProps {
  popoverSide?: Position;
}

const FreeBetaPricing = ({ popoverSide = 'bottom' }: FreeBetaPricingProps) => {
  const { t } = useTranslation('pricing');

  return (
    <div data-testid="free-beta-container" className="flex items-center gap-2">
      <span className="font-semibold text-green">{t('freeBetaLabel')}</span>
      <Popover>
        <PopoverTrigger>
          <HelpCircle className="size-4 text-green" />
        </PopoverTrigger>
        <PopoverContent className="text-sm text-green" side={popoverSide}>
          <p>{t('freeBetaPopover')}</p>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FreeBetaPricing;
