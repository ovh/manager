import { Outlet } from 'react-router-dom';

export const Handle = {
  breadcrumb: () => 'pci_ai_breadcrumb_notebooks_order',
};

export default function NotebookOrderFunnelLayout() {
  return (
    <>
      <Outlet />      
    </>
  );
}