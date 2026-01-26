import { ColumnDef } from '@tanstack/react-table';
import { useGetIpdetails } from '@/data/hooks/ip';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Region
 * If ip has no region display "-"
 * If ip has multiple regions display them vertically
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpRegion: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const { ipDetails, loading } = useGetIpdetails({ ip });

  if (parentIpGroup) {
    return <></>;
  }

  return (
    <SkeletonCell loading={loading}>
      <div className="flex flex-col">
        {!ipDetails?.regions && <>-</>}
        {ipDetails?.regions?.map((region) => (
          <div key={region}>{region}</div>
        ))}
      </div>
    </SkeletonCell>
  );
};
