import React, { Suspense } from 'react';
import ReactNavbar from '@/navbar/index.jsx';
import appContext from '@/context';

function ShellHeader() {
  return (
    <Suspense fallback="">
      <ReactNavbar environment={appContext.getEnvironment()} />
    </Suspense>
  );
}

export default ShellHeader;
