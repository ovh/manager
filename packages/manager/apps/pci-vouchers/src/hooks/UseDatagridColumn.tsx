import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TVoucher } from '@/interface';
import DisplayName from '@/components/vouchers/listing/DisplayName';
import Validity from '@/components/vouchers/listing/Validity';
import Credit from '@/components/vouchers/listing/Credit';

export const useDatagridColumn = () => {
  const { t } = useTranslation('common');
  return [
    {
      id: 'description',
      cell: (props: TVoucher) => <DisplayName voucher={props}></DisplayName>,
      label: t('cpb_vouchers_name_cell'),
    },
    {
      id: 'products',
      cell: (props: TVoucher) => (
        <DataGridTextCell>
          {props.products || t('cpb_vouchers_products_all')}
        </DataGridTextCell>
      ),
      label: t('cpb_vouchers_products_cell'),
    },
    {
      id: 'voucher',
      cell: (props: TVoucher) => (
        <DataGridTextCell>{props.voucher}</DataGridTextCell>
      ),
      label: t('cpb_vouchers_voucher_cell'),
    },
    {
      id: 'validityFrom',
      cell: (props: TVoucher) => <Validity date={props.validity.from} />,
      label: t('cpb_vouchers_validity_from_cell'),
    },

    {
      id: 'total_credit',
      cell: (props: TVoucher) => <Credit credit={props.total_credit} />,
      label: t('cpb_vouchers_total_credit_cell'),
    },
    {
      id: 'validityTo',
      cell: (props: TVoucher) => <Validity date={props.validity.to} />,
      label: t('cpb_vouchers_validity_to_cell'),
    },
    {
      id: 'available_credit',
      cell: (props: TVoucher) => <Credit credit={props.available_credit} />,
      label: t('cpb_vouchers_available_credit_cell'),
    },
  ];
};
