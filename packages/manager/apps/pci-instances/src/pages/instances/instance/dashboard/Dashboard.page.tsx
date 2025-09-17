import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import InstanceGeneralInfoBlock from './components/InstanceGeneralInfoBlock.component';
import InstancePropertyBlock from './components/InstancePropertyBlock.component';
import InstanceNetworkingBlock from './components/InstanceNetworkingBlock.component';
import BackupBlock from './components/BackupBlock.component';

const Dashboard: FC = () => (
  <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
    <InstanceGeneralInfoBlock />
    <article className="flex flex-col gap-y-4">
      <InstancePropertyBlock />
      <BackupBlock />
    </article>
    <InstanceNetworkingBlock />
    <Outlet />
  </div>
);

export default Dashboard;
