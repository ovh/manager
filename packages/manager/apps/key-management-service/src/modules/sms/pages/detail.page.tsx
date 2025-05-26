import React from 'react';
import { useParams } from 'react-router-dom';

export default function SecretDetailPage() {
  const { domainId, secretId } = useParams();

  return (
    <div>
      <h1>Secret Detail</h1>
      <p>This page shows the details of a specific secret.</p>
      <p>Domain id: {domainId}</p>
      <p>Secret id: {secretId}</p>
    </div>
  );
}
