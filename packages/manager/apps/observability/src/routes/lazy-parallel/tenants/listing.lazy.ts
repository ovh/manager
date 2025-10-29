import React from 'react';

const tenantsImport = import('@/pages/tenants/TenantsListing.page');
const deleteModalImport = import('@/pages/tenants/delete/DeleteTenantModal.page');

const TenantsPage = React.lazy(() => tenantsImport.then((module) => ({ default: module.default })));
const DeleteTenantModal = React.lazy(() =>
  deleteModalImport.then((module) => ({ default: module.default })),
);

export { TenantsPage, DeleteTenantModal };
