import React, { startTransition } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OptionCard } from '@/components/OptionCard/OptionCard.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';

import { ByoipContext } from '../Byoip.context';
import { AS_OPTIONS } from '../Byoip.utils';
import { AsOwnTypeSelectionSubSection } from './AsOwnTypeSelectionSubSection.component';

export const AsTypeSelectionSection: React.FC = () => {
  const { t } = useTranslation('byoip');
  const { asType, setAsType } = React.useContext(ByoipContext);
  const { trackClick } = useOvhTracking();

  return (
    <>
      <OrderSection
        title={t('ip_byoip_as_system_title')}
        description={t('ip_byoip_as_system_description')}
      >
        <div className="grid grid-cols-2 gap-3">
          {AS_OPTIONS.map((value) => (
            <OptionCard
              key={value}
              hasRadioButton={true}
              title={t(`ip_byoip_as_type_${value}`)}
              isSelected={asType === value}
              onClick={() => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.funnel,
                  actions: [`select_${value}`],
                });
                startTransition(() => {
                  setAsType(value);
                });
              }}
            />
          ))}
        </div>
      </OrderSection>
      {asType === 'own' && <AsOwnTypeSelectionSubSection />}
    </>
  );
};
