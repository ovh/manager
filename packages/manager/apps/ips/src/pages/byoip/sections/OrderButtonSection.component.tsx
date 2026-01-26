import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
} from '@ovhcloud/ods-react';

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
      <Button
        color={BUTTON_COLOR.primary}
        size={BUTTON_SIZE.md}
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
      >
        {t('next', { ns: NAMESPACES.ACTIONS })}
      </Button>
      <Button
        color={BUTTON_COLOR.primary}
        size={BUTTON_SIZE.md}
        variant={BUTTON_VARIANT.outline}
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
      >
        {t('cancel', { ns: NAMESPACES.ACTIONS })}
      </Button>
    </div>
  );
};
