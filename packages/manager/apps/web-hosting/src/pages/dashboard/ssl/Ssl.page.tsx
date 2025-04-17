import React from 'react';

import Topbar from '@/components/topBar/TopBar.component';
import { MessageList } from '@/components/message/MessageList.component';

export default function Ssl() {
  return (
    <React.Suspense>
      <MessageList />
      <Topbar />
    </React.Suspense>
  );
}
