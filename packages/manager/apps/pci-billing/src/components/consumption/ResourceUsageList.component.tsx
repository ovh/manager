import { TResourceUsage } from '@/api/hook/useConsumption';
import {
  ResourcesColumn,
  useResourceUsageListColumns,
} from './useResourceUsageListColumns';
import CommonUsageList from './CommonUsageList';

type ResourceUsageListProps = {
  resourcesUsage: TResourceUsage[];
  disabledColumns?: ResourcesColumn[];
};

export default function ResourceUsageList({
  resourcesUsage,
  disabledColumns,
}: Readonly<ResourceUsageListProps>) {
  const columns = useResourceUsageListColumns({ disabledColumns });

  return <CommonUsageList resourcesUsage={resourcesUsage} columns={columns} />;
}
