import React from 'react';

import { Datagrid } from '@ovh-ux/muk';

import { useShares } from '@/data/hooks/shares/useShares';
import { useShareColumn } from '@/pages/list/hooks/useShareColumn';
import { TShareListRow } from '@/pages/list/view-model/shareList.view-model';
import { selectSharesForList } from '@/pages/list/view-model/shareList.view-model';

import { ShareDatagridTopbar } from './ShareDatagridTopbar.component';

export const ShareDatagrid: React.FC = () => {
  const { data: shares = [], isLoading } = useShares({
    select: selectSharesForList,
  });
  const columns = useShareColumn();

  return (
    <div className="w-full min-w-0">
      <Datagrid<TShareListRow>
        columns={columns}
        data={shares}
        totalCount={shares.length}
        isLoading={isLoading}
        topbar={<ShareDatagridTopbar />}
      />
    </div>
  );
};
