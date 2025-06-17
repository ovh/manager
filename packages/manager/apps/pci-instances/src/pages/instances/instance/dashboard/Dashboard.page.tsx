import { FC } from 'react';
import InstanceGeneralDetails from '../component/InstanceGeneralDetails.component';

const Dashboard: FC = () => (
  <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
    <InstanceGeneralDetails />
  </div>
);

export default Dashboard;
