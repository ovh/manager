import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ShellProvider } from '@ovh-ux/manager-react-shell-client';
import HidePreloader from '@/core/HidePreloader';
import appRoutes from '@/routes';

const router = createHashRouter(appRoutes);

function App() {
  return (
    <>
      <ShellProvider appName="pci-localzone-instance">
        <RouterProvider router={router}></RouterProvider>
        <HidePreloader />
      </ShellProvider>
    </>
  );
}

export default App;
