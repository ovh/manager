import React from 'react';
import { BillingInformationsTileStandard } from '@ovh-ux/billing-informations';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import useProductType, { ProductType } from '@/common/hooks/useProductType';

const useResiliateLink = (okms: OKMS) => {
  const productType = useProductType();

  const resiliateLinks: Record<ProductType, string> = {
    'key-management-service': KMS_ROUTES_URIS.kmsTerminate,
    'secret-manager': SECRET_MANAGER_ROUTES_URLS.okmsTerminateModal(okms.id),
  };

  return resiliateLinks[productType];
};

type BillingTileProps = {
  okms: OKMS;
};

export const BillingTile = ({ okms }: BillingTileProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const resiliateLink = useResiliateLink(okms);

  const handleResiliateLinkClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete_kms'],
    });
    navigate(resiliateLink);
  };

  return (
    <BillingInformationsTileStandard
      resourceName={okms.id}
      onResiliateLinkClick={handleResiliateLinkClick}
    />
  );
};
