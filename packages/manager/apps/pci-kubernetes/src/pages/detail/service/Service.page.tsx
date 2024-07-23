import { Outlet } from 'react-router-dom';
import ClusterInformation from '@/components/information/ClusterInformation.component';
import ClusterAccessAndSecurity from '@/components/information/ClusterAccessAndSecurity.component';

export default function ServicePage() {
  return (
    <div className="flex gap-10">
      <ClusterInformation />
      <ClusterAccessAndSecurity />
      <Outlet />
    </div>
  );
}
