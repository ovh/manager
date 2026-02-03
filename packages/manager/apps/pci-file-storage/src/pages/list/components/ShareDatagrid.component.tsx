import React from 'react';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { Datagrid } from '@ovh-ux/muk';

import { useShares } from '@/data/hooks/shares/useShares';
import { useShareColumn } from '@/pages/list/hooks/useShareColumn';
import { selectSharesForList } from '@/pages/list/view-model/shareList.view-model';

import { ShareDatagridTopbar } from './ShareDatagridTopbar.component';

// This is needed to handle the datagrid container imposed by MUK. If we don't do this we get a vertical scroll that's not wanted. No better solution was found (yet) //
const getContainerHeight = (dataSize: number) => (dataSize + 1) * 50 + 10;

export const ShareDatagrid: React.FC = () => {
  const { data: shares = [], isLoading } = useShares({
    select: selectSharesForList,
  });
  const columns = useShareColumn();

  return (
    <div className="[&_th]:!break-normal">
      <Datagrid
        columns={columns}
        data={[...shares]}
        totalCount={shares.length}
        isLoading={isLoading}
        topbar={<ShareDatagridTopbar />}
        containerHeight={getContainerHeight(shares.length)}
        maxRowHeight={50}
        size={TABLE_SIZE.sm}
      />
    </div>
  );
};
