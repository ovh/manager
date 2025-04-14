import React from 'react';
import { Notifications } from '@ovh-ux/manager-react-components';

import Loading from '@/components/loading/Loading.component';

export default function Ssl() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Notifications />
    </React.Suspense>
  );
}
