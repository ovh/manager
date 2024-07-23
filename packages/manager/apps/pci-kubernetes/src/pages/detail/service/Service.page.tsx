import { Outlet } from 'react-router-dom';
import ClusterInformation from '@/components/information/ClusterInformation.component';

export default function ServicePage() {
  return (
    <div>
      <ClusterInformation />
      <Outlet />
    </div>
  );
}
