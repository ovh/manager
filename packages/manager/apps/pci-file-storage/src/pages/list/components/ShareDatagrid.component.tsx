import React from 'react';

import { Datagrid } from '@ovh-ux/muk';

import { TShareListRow } from '@/adapters/shares/left/shareList.data';
import { useShares } from '@/data/hooks/shares/useShares';
import { useShareColumn } from '@/pages/list/hooks/useShareColumn';
import { selectSharesForList } from '@/pages/list/view-model/shareList.view-model';

export const ShareDatagrid: React.FC = () => {
  const { data: shares = [], isLoading } = useShares({
    select: selectSharesForList,
  });
  const columns = useShareColumn();

  return (
    <Datagrid<TShareListRow>
      columns={columns}
      data={shares}
      totalCount={shares.length}
      isLoading={isLoading}
    />
  );
};
