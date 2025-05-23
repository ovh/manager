import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

export const OrderButtonSection: React.FC = () => {
  const { t: tcommon } = useTranslation(NAMESPACES?.ACTIONS);
  const navigate = useNavigate();

  return (
    <div className="flex gap-3">
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        label={tcommon('next')}
        onClick={() => navigate(urls.byoipOrderModal)}
      />
      <OdsButton
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.md}
        variant={ODS_BUTTON_VARIANT.ghost}
        label={tcommon('cancel')}
        onClick={() => navigate(urls.listing)}
      />
    </div>
  );
};
