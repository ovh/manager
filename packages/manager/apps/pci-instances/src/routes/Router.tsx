import { FC, useContext, useMemo } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getRoutes } from '@/routes/routes';

const Router: FC = () => {
  const shell = useContext(ShellContext);

  const router = useMemo(() => createHashRouter(getRoutes(shell)), [shell]);

  return <RouterProvider router={router} />;
};

export default Router;
