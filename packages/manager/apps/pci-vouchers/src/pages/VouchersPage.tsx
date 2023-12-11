import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Notifications } from '@/components/Notifications';

export default function VouchersPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <h1>{t('cpb_project_management_credit_vouchers')}</h1>
      <Link to="./add">Add</Link>
      <Link to="./buy">Buy</Link>
      <Notifications />
      <Outlet />
    </>
  );
}
