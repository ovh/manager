import React, { startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { AS_OPTIONS } from '../Byoip.utils';
import { ByoipContext } from '../Byoip.context';

export const AsTypeSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { asType, setAsType } = React.useContext(ByoipContext);

  const handleAsTypeChange = (value: string) => {
    startTransition(() => {
      setAsType(value);
    });
  };

  return (
    <OrderSection
      title={t('ip_byoip_as_system_title')}
      description={t('ip_byoip_as_system_description')}
    >
      <div className="grid grid-rows-2 gap-3">
        {AS_OPTIONS.map((value) => (
          <OptionCard
            key={value}
            title={t(`ip_byoip_as_type_${value}`)}
            isSelected={asType === value}
            onClick={() => handleAsTypeChange(value)}
          />
        ))}
      </div>
    </OrderSection>
  );
};
