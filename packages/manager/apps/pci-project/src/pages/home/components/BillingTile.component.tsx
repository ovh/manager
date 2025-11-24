import { ManagerTile, useFormatDate } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useCreditDetails } from '@/data/hooks/useCredit';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';

export default function BillingTile() {
  const { t } = useTranslation('home');

  const projectId = useProjectIdFromParams();
  const formatDate = useFormatDate();

  const { data: vouchersCreditDetails = [] } = useCreditDetails(projectId);

  if (vouchersCreditDetails?.length === 0) {
    return null;
  }

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('pci_projects_home_billing')}</ManagerTile.Title>
      <ManagerTile.Divider />

      {vouchersCreditDetails.map((item, itemIdx: number) => (
        <ManagerTile.Item key={itemIdx}>
          <ManagerTile.Item.Label>
            {t('pci_projects_home_billing_voucher_credit', {
              voucher: item.voucher,
            })}
          </ManagerTile.Item.Label>
          <ManagerTile.Item.Description>
            {item.description && (
              <OdsText className="block">{item.description}</OdsText>
            )}
            {item.balance && (
              <OdsText className="block my-5 font-32 font-bold">
                {item.balance}
              </OdsText>
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
    </ManagerTile>
  );
}
