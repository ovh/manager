import { FC } from 'react';
import Information from './component/Information.component';
import Property from './component/Property.component';
import Network from './component/Network.component';

const Dashboard: FC = () => (
  <div className="grid grid-cols-1 md:items-start md:grid-cols-3 gap-4 md:gap-6">
    <Information />
    <Property />
    <Network />
  </div>
);

export default Dashboard;
