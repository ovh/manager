import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import InstanceGeneralInfoBlock from './components/InstanceGeneralInfoBlock.component';

const Dashboard: FC = () => (
  <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
    <InstanceGeneralInfoBlock />
    <Outlet />
  </div>
);

export default Dashboard;
