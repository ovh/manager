/* eslint-disable prettier/prettier */
import { v6, v2 } from '@ovh-ux/manager-core-api';

export const getUserId = async (projectId: string) => {
  const { data } = await v6.get(
    `/me/identity/user/ai-endpoints-user-${projectId}`,
  );
  return data;
};

export const createUserId = async (projectId: string) => {
  const payload = {
    description: `A user created for AI endpoints, linked to ${projectId}`,
    email: `ai-endpoints-user-${projectId}@ovhcloud.com`,
    login: `ai-endpoints-user-${projectId}`,
    password: `${projectId}`,
    group: 'UNPRIVILEGED',
  };

  const { data } = await v6.post('/me/identity/user', payload, {
    headers: { 'content-type': 'application/json' },
  });

  return data;
};

export const getPolicy = async () => {
  const { data } = await v2.get('/iam/policy', {
    headers: { accept: 'application/json' },
  });
  return data;
};

export const createPolicy = async (projectId: string, urn: string) => {
  let region = 'eu';

  if (urn.includes('urn:v1:ca')) {
    region = 'ca';
  } else if (urn.includes('urn:v1:eu')) {
    region = 'eu';
  }

  const payload = {
    name: `call-endpoints-policy-pci-${projectId}`,
    description:
      'Policy for allowing to use AI endpoints on specific public cloud projects',
    identities: [`${urn}`],
    resources: [
      { urn: `urn:v1:${region}:resource:publicCloudProject:${projectId}` },
    ],
    permissions: {
      allow: [{ action: 'publicCloudProject:ai:endpoints/call' }],
    },
  };

  const { data } = await v2.post('/iam/policy', payload, {
    headers: { 'content-type': 'application/json' },
  });

  return data;
};
