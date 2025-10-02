import { Suspense } from 'react';

import { RouterProvider, createMemoryRouter, createRoutesFromElements } from 'react-router-dom';

import Routes from '@/routes/Routes';

export function TestApp({ initialRoute = '/' }: { initialRoute: string }) {
  const routes = createRoutesFromElements(Routes);
  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
    initialIndex: 0,
  });

  return (
    <Suspense fallback={'Loading....'}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
