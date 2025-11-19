import { Navigate, Route } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';

export default (
  <Route path="/" element={<Navigate to={KMS_ROUTES_URLS.kmsListing} replace={true} />} />
);
