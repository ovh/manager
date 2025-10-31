import React from 'react';
import { taskMeDns } from '@/constants';
import { ParentEnum } from '@/enum/parent.enum';
import DashboardPage from '@/components/Dashboard/DashboardPage';

export default function Domain() {
  return (
    <React.Suspense>
      <DashboardPage
        searchableColumnID={ParentEnum.ZONE}
        parent={ParentEnum.ZONE}
        route={`${taskMeDns.join('/')}`}
        queryKey={taskMeDns}
      />
    </React.Suspense>
  );
}
