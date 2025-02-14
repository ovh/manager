import { PrometheusData } from '@/data/api/database/prometheus.api';
import { Table, TableBody } from '@/components/ui/table';
import * as database from '@/types/cloud/project/database';
import PrometheusTableRow from './PrometheusTableRow.component';

interface PrometheusSrvProps {
  prometheusData: PrometheusData;
}
const PrometheusSrv = ({ prometheusData }: PrometheusSrvProps) => {
  const promData = prometheusData as database.mongodb.PrometheusEndpoint;
  return (
    <div className="w-full">
      <Table>
        <TableBody>
          <PrometheusTableRow name="username" value={promData.username} />
          <PrometheusTableRow name="srvDomain" value={promData.srvDomain} />
        </TableBody>
      </Table>
    </div>
  );
};

export default PrometheusSrv;
