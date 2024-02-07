import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Voucher } from '@/interface';
import DataGridTextCell from '@/components/datagrid/DataGridTextCell';
import { getBill } from '@/data/bill';
import style from '@/components/common.module.css';

export default function DisplayName({
  voucher,
}: {
  voucher: Pick<Voucher, 'bill' | 'description'>;
}) {
  const { t } = useTranslation('common');
  if (voucher.bill) {
    const { data } = useQuery({
      queryKey: ['bill', voucher.bill],
      queryFn: () => getBill(`${voucher.bill}`),
    });
    return (
      <DataGridTextCell>
        <span>{t('cpb_vouchers_name_credit_provisionning')}</span>
        <br />
        {data && (
          <span
            className={style.linkContainer}
            dangerouslySetInnerHTML={{
              __html: t('cpb_vouchers_bill_ref', {
                billId: voucher.bill,
                url: data?.pdfUrl,
                interpolation: { escapeValue: false },
              }),
            }}
          ></span>
        )}
        {!data && (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.sm}
            data-testid="spinner"
          />
        )}
      </DataGridTextCell>
    );
  }
  return <DataGridTextCell>{voucher.description}</DataGridTextCell>;
}
