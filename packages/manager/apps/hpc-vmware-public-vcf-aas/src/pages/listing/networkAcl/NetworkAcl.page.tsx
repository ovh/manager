import { Suspense } from 'react';

import { NetworkAclProvider } from './NetworkAcl.context';
import NetworkAclListContent from './NetworkAclListContent.component';

export default function NetworkAclList() {
  return (
    <Suspense>
      <NetworkAclProvider>
        <NetworkAclListContent />
      </NetworkAclProvider>
    </Suspense>
  );
}
