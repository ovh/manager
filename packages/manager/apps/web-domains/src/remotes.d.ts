declare module 'webDomainsMfe/App' {
  import React from 'react';

  interface RemoteAppProps {
    shellContext: any;
  }

  const RemoteApp: React.ComponentType<RemoteAppProps>;
  export default RemoteApp;
}
