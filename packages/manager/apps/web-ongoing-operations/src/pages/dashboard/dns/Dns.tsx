import React from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { taskMeDns } from '@/constants';
import { ParentEnum } from '@/enum/parent.enum';
import DashboardPage from '@/components/Dashboard/DashboardPage';

export default function Domain() {
  const { notifications } = useNotifications();

  return (
    <React.Suspense>
      <DashboardPage
        id={ParentEnum.ZONE}
        parent={ParentEnum.ZONE}
        notifications={notifications}
        route={`${taskMeDns.join('/')}`}
        queryKey={taskMeDns}
      />
    </React.Suspense>
  );
}
