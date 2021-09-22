import React, { Suspense } from 'react';
import ReactNavbar from '@/navbar/index.jsx';
import ApplicationContext from '@/context';

function ShellHeader() {
  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <ReactNavbar environment={environment} />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default ShellHeader;
