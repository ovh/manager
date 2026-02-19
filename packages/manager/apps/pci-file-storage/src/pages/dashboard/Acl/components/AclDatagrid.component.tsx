import { type FC } from 'react';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/muk';

import { AclDatagridTopbar } from '@/pages/dashboard/Acl/components/AclDatagridTopbar.component';
import { useAclColumn } from '@/pages/dashboard/Acl/hooks/useAclColumn';

export const AclDatagrid: FC = () => {
  const columns = useAclColumn();

  return (
    <div className="[&_th]:!break-normal">
      <Datagrid
        columns={columns}
        data={[]}
        maxRowHeight={50}
        size={TABLE_SIZE.sm}
        topbar={<AclDatagridTopbar />}
      />
    </div>
  );
};
