import { FC } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import routes from '@/routes';

const router = createHashRouter(routes);

const Router: FC = () => <RouterProvider router={router} />;

export default Router;
