import { RouterProvider, createHashRouter } from 'react-router-dom';
import appRoutes from '@/routes';

const router = createHashRouter(appRoutes);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
