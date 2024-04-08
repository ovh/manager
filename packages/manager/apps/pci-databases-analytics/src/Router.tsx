import { RouterProvider, createHashRouter } from 'react-router-dom';
import appRoutes from '@/routes';

const router = createHashRouter(appRoutes);

const Router = () => <RouterProvider router={router} />;

export default Router;
