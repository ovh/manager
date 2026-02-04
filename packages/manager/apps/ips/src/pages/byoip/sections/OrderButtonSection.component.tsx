import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/routes.constant';

import { ByoipContext } from '../Byoip.context';

export const OrderButtonSection: React.FC = () => {
  const { t } = useTranslation([NAMESPACES?.ACTIONS]);
  const { ipRir, selectedRegion } = React.useContext(ByoipContext);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex gap-4">
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        label={t('next', { ns: NAMESPACES.ACTIONS })}
        onClick={() => {
          trackClick({
            actionType: 'action',
            buttonType: ButtonType.button,
            location: PageLocation.funnel,
            actions: [
              'go-to_bring-your-own-ip',
              'confirm',
              `rir_${ipRir.toLowerCase()}`,
              `Ip-location_${selectedRegion.toLowerCase()}`,
            ],
          });
          navigate(urls.byoipOrderModal);
        }}
      />
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.outline}
        label={t('cancel', { ns: NAMESPACES.ACTIONS })}
        onClick={() => {
          trackClick({
            actionType: 'action',
            buttonType: ButtonType.button,
            location: PageLocation.funnel,
            actions: [
              'go-to_bring-your-own-ip',
              'cancel',
              `rir_${ipRir.toLowerCase()}`,
              `Ip-location_${selectedRegion.toLowerCase()}`,
            ],
          });
          navigate(urls.listing);
        }}
      />
    </div>
  );
};
