import React from 'react';
import './index.scss';
import { ViewContextProvider } from '@/components/manageView/viewContext';
import ServerDatagrid from '@/components/serverDatagrid';

export default function ServerListing() {
  return (
    <ViewContextProvider>
      <ServerDatagrid />
    </ViewContextProvider>
  );
}
