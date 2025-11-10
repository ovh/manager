import { useTranslation } from 'react-i18next';

import { NAMESPACES } from "@ovh-ux/manager-common-translations"

import {BillingNameCell, BillingPriceCell, BillingUsageCell} from '../_components';
import { ServiceDetails } from "@ovh-ux/manager-module-common-api";

export const ID_LABEL = 'ID';

export const useColumns = () => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.FORM]);

  return [
    {
      id: 'resource.displayName',
      cell: (agoraService: ServiceDetails) => <BillingNameCell serviceId={agoraService.serviceId} displayName={agoraService.resource.displayName} />,
      label: t(`${NAMESPACES.DASHBOARD}:name`),
    },
    {
      id: 'usage',
      cell: (agoraService: ServiceDetails) => <BillingUsageCell usage={agoraService.resource.displayName} />,
      label: t(`${NAMESPACES.DASHBOARD}:consumption`),
    },
    {
      id: 'billing.pricing.price.value',
      cell: (agoraService: ServiceDetails) => <BillingPriceCell priceText={agoraService.billing.pricing.price.text} />,
      label: t(`${NAMESPACES.FORM}:price`),
    },
  ];
};
