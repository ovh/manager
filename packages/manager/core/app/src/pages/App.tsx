import React from 'react';
import { useRoutes } from 'react-router-dom';
import useBreadcrumbs, {
  createRoutesFromChildren,
} from 'use-react-router-breadcrumbs';
import Breadcrumb from '@/components/Breadcrumb';

import Routing from './Routing';

export default function App() {
  const routing = createRoutesFromChildren(Routing());
  return (
    <>
      <Breadcrumb breadcrumbs={useBreadcrumbs(routing)} />
      {useRoutes(routing)}
    </>
  );
}
