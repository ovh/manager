import { OrgDetails } from '@/data/api';
import { ColumnDef } from '@tanstack/react-table';

export const OrganisationsNameCell: ColumnDef<OrgDetails>['cell'] = ({
  row,
}) => {
  const { firstname, lastname } = row.original;
  return <>{`${firstname} ${lastname}`}</>;
};
