import { OdsDatagridColumn } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

import reactFormatter from '@/helpers';
import { Voucher } from '@/interface';

import Product from './listing/Product';
import ValidityFrom from './listing/ValidityFrom';
import TotalCredit from './listing/TotalCredit';
import ValidityTo from './listing/ValidityTo';
import AvailableCredit from './listing/AvailableCredit';

import Listing from '../Listing';

interface VouchersListingProps {
  vouchers: Voucher[];
}

export default function VouchersListing({ vouchers }: VouchersListingProps) {
  const { t } = useTranslation('common');
  const headers: OdsDatagridColumn[] = [
    {
      title: t('cpb_vouchers_name_cell'),
      field: 'description',
      isSortable: false,
    },
    {
      title: t('cpb_vouchers_products_cell'),
      field: 'products',
      isSortable: true,
      formatter: reactFormatter(<Product></Product>),
    },
    {
      title: t('cpb_vouchers_voucher_cell'),
      field: 'voucher',
      isSortable: true,
    },
    {
      title: t('cpb_vouchers_validity_from_cell'),
      field: 'validity.from',
      isSortable: true,
      formatter: reactFormatter(<ValidityFrom></ValidityFrom>),
    },
    {
      title: t('cpb_vouchers_total_credit_cell'),
      field: 'totalCredit',
      isSortable: true,
      formatter: reactFormatter(<TotalCredit></TotalCredit>),
    },
    {
      title: t('cpb_vouchers_validity_to_cell'),
      field: 'validity.to',
      isSortable: true,
      formatter: reactFormatter(<ValidityTo></ValidityTo>),
    },
    {
      title: t('cpb_vouchers_available_credit_cell'),
      field: 'availableCredit',
      isSortable: true,
      formatter: reactFormatter(<AvailableCredit></AvailableCredit>),
    },
  ];

  return <Listing headers={headers} items={vouchers} />;
}
