import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import Boot from '@/components/instance/Boot';
import { LoaderData as DashboardLoaderData } from './DashboardPage';

export default function BootPage() {
  const { instance } = useRouteLoaderData(
    'instances.dashboard',
  ) as DashboardLoaderData;
  const navigate = useNavigate();

  const onClose = () => {
    navigate('..');
  };
  return (
    <>
      <Boot instance={instance} onClose={() => onClose()} />
    </>
  );
}
