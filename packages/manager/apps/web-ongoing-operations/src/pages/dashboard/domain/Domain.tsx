import React from 'react';
import DashboardPage from '@/components/Dashboard/DashboardPage';
import { ParentEnum } from '@/enum/parent.enum';
import { taskMeDomain } from '@/constants';

export default function Domain() {
  return (
    <React.Suspense>
      <DashboardPage
        searchableColumnID={ParentEnum.DOMAIN}
        parent={ParentEnum.DOMAIN}
        route={`${taskMeDomain.join('/')}?type=domain`}
        queryKey={taskMeDomain}
      />
    </React.Suspense>
  );
}
