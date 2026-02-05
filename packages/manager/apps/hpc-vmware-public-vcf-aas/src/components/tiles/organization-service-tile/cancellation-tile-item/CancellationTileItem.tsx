import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { subRoutes } from '@/routes/routes.constant';

export default function CancellationTileItem({ isDisabled }: { isDisabled: boolean }) {
  const { t: tBilling } = useTranslation(NAMESPACES.BILLING);
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-x-3">
      <OdsButton
        label={tBilling('cancel_service')}
        variant="ghost"
        iconAlignment="right"
        isDisabled={isDisabled}
        onClick={() => navigate(subRoutes.terminate)}
        icon="chevron-right"
      />
    </div>
  );
}
