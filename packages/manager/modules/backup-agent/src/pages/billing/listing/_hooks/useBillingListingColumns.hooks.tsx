import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { Resource } from '@/types/Resource.type';
import { Vault } from '@/types/Vault.type';

import { BillingNameCell, BillingPriceCell, BillingUsageCell } from '../_components';

export const ID_LABEL = 'ID';

export const useColumns = () => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.FORM]);

  return [
    {
      id: 'resource.displayName',
      cell: (vault: Resource<Vault>) => (
        <BillingNameCell id={vault.id} name={vault.currentState.name} />
      ),
      label: t(`${NAMESPACES.DASHBOARD}:name`),
    },
    {
      id: 'usage',
      cell: (vault: Resource<Vault>) => <BillingUsageCell vaultId={vault.id} />,
      label: t(`${NAMESPACES.DASHBOARD}:consumption`),
    },
    {
      id: 'billing.pricing.price.value',
      cell: (vault: Resource<Vault>) => <BillingPriceCell vaultId={vault.id} />,
      label: t(`${NAMESPACES.FORM}:price`),
    },
  ];
};
