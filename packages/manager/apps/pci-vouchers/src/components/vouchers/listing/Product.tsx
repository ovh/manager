import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

export default function Product({ product }: { product: string[] | null }) {
  const { t } = useTranslation('common');
  return (
    <DataGridTextCell>
      {product?.join(', ') || t('cpb_vouchers_products_all')}
    </DataGridTextCell>
  );
}
