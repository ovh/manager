import { Outlet } from 'react-router-dom';

export const Handle = {
  breadcrumb: () => 'pci_cdb_breadcrumb_services',
};

const ServicesLayout = () => {
  return <Outlet />;
};

export default ServicesLayout;
