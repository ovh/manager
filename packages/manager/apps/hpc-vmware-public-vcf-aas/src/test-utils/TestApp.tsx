import React, { Suspense } from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
} from 'react-router-dom';
import Routes from '@/routes/routes';
import { MessageContextProvider } from '@/context/Message.context';
import Loading from '@/components/loading/Loading.component';

export function TestApp({ initialRoute = '/' }) {
  const routes = createRoutesFromElements(Routes);
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  return (
    <MessageContextProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </MessageContextProvider>
  );
}
