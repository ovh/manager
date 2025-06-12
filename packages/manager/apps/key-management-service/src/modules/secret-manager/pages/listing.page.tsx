import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';

export default function SecretListingPage() {
  const navigate = useNavigate();
  const { domainId } = useParams();

  return (
    <div>
      <h1>Secrets Listing</h1>
      <p>This is the secrets listing page</p>
      <p>Domain id: {domainId}</p>
      <OdsButton
        label="Go to secret Detail"
        onClick={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.secretDashboard('1234', 'xyz'))
        }
      />
    </div>
  );
}
