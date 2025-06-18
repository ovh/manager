import React from 'react';
import { useParams } from 'react-router-dom';
import { decodeSecretPath } from '@/modules/secret-manager/utils/secretPath';

type SecretDetailPageParams = {
  domainId: string;
  secretPath: string;
};

export default function SecretDetailPage() {
  const { domainId, secretPath } = useParams<SecretDetailPageParams>();

  return (
    <div>
      <h1>Secret Detail</h1>
      <p>This page shows the details of a specific secret.</p>
      <p>Domain id: {domainId}</p>
      <p>Secret id: {decodeSecretPath(secretPath)}</p>
    </div>
  );
}
