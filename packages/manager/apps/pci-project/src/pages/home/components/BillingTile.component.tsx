import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';

import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';

import { useCreditDetails } from '@/data/hooks/useCredit';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';

export default function BillingTile() {
  const { t } = useTranslation('home');

  const projectId = useProjectIdFromParams();
  const formatDate = useFormatDate();

  const { data: vouchersCreditDetails = [] } = useCreditDetails(projectId);

  const hrefProject = usePciUrl();
  const creditAndVouchersUrl = `${hrefProject}/vouchers`;

  if (vouchersCreditDetails?.length === 0) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('pci_projects_home_billing')}</ManagerTile.Title>
      <ManagerTile.Divider />

      {vouchersCreditDetails.slice(0, 3).map((item, itemIdx: number) => (
        <ManagerTile.Item key={itemIdx}>
          <ManagerTile.Item.Label>
            {t('pci_projects_home_billing_voucher_credit', {
              voucher: item.voucher,
            })}
          </ManagerTile.Item.Label>
          <ManagerTile.Item.Description>
            {item.description && <OdsText className="block">{item.description}</OdsText>}
            {item.balance && (
              <OdsText className="font-32 my-5 block font-bold">{item.balance}</OdsText>
            )}
            {item.expirationDate && (
              <OdsText className="block">
                {t('pci_projects_home_billing_active_credit_balance', {
                  expirationDate: formatDate({
                    date: item.expirationDate,
                    format: 'PPPp',
                  }),
                })}
              </OdsText>
            )}
          </ManagerTile.Item.Description>
          <ManagerTile.Divider />
        </ManagerTile.Item>
      ))}
      <OdsLink
        icon="external-link"
        target="_blank"
        href={creditAndVouchersUrl}
        label={t('pci_projects_home_credits_vouchers')}
      />
    </ManagerTile>
  );
}
