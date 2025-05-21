import React from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ParentEnum } from '@/enum/parent.enum';
import { taskMeAllDom, taskMeDomain } from '@/constants';
import DashboardPage from '@/components/Dashboard/DashboardPage';

export default function AllDom() {
  const { notifications } = useNotifications();

  // We use TaskMeDomain here because the alldom task has the same api route than domain tasks, only the type change.

  return (
    <React.Suspense>
      <DashboardPage
        parent={ParentEnum.ALLDOM}
        notifications={notifications}
        route={`${taskMeDomain.join('/')}?type=alldom`}
        queryKey={taskMeAllDom}
        testID={'allDom'}
      />
    </React.Suspense>
  );
}
