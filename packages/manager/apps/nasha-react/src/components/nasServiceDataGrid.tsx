import React from 'react';
import Datagrid from './layout-helpers/list/Datagrid';

interface NasServiceDataGridProps {
  data: DataItem[];
}
interface DataItem {
  [key: string]: NasService;
}
type NasService = {
  canCreatePartition: boolean;
  customName: string;
  datacenter: string;
  diskType: string;
  ip: string;
  monitored: boolean;
  serviceName: string;
  zpoolCapacity: number;
  zpoolSize: number;
};

const NasServiceDataGrid: React.FC<NasServiceDataGridProps> = ({ data }) => {
  const link = 'serviceName';

  return <Datagrid data={data} link={link} />;
};

export default NasServiceDataGrid;
