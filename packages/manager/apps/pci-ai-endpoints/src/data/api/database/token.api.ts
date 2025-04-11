import { v6 } from '@ovh-ux/manager-core-api';

interface TokenEndpoints {
  projectId: string;
  name?: string;
  description?: string;
  expiresAt?: string;
}

export const getTokens = async ({ projectId }: TokenEndpoints) => {
  const { data } = await v6.get(
    `/me/identity/user/ai-endpoints-user-${projectId}/token`,
  );
  return data;
};

export const getToken = async ({ projectId, name }: TokenEndpoints) => {
  const { data } = await v6.get(
    `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
  );
  return data;
};

export const createToken = async ({
  projectId,
  name,
  description,
  expiresAt,
}: TokenEndpoints) => {
  const body = {
    name: name || '',
    description: description || '',
    expiresAt: expiresAt || null,
  };
  const { data } = await v6.post(
    `/me/identity/user/ai-endpoints-user-${projectId}/token`,
    body,
  );
  return data;
};

export const updateToken = async ({
  projectId,
  name,
  description,
  expiresAt,
}: {
  projectId: string;
  name: string;
  description: string;
  expiresAt: string;
}) => {
  const body = {
    description: description || '',
    expiresAt: expiresAt || null,
  };
  const { data } = await v6.put(
    `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
    body,
  );
  return data;
};

export const deleteToken = async ({ projectId, name }: TokenEndpoints) => {
  const { data } = await v6.delete(
    `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
  );
  return data;
};
