import React from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import DashboardPage from '@/components/Dashboard/DashboardPage';
import { ParentEnum } from '@/enum/parent.enum';
import { taskMeDomain } from '@/constants';

export default function Domain() {
  const { notifications } = useNotifications();

  return (
    <React.Suspense>
      <DashboardPage
        parent={ParentEnum.DOMAIN}
        notifications={notifications}
        route={`${taskMeDomain.join('/')}?type=domain`}
        queryKey={taskMeDomain}
        testID={'domain'}
      />
    </React.Suspense>
  );
}
