import { useState, useEffect } from 'react';
import {
  getUserId,
  createUserId,
  getPolicy,
  createPolicy,
} from '@/data/api/policies/user.api';

const useUserPolicy = (projectId?: string) => {
  const [userUrn, setUserUrn] = useState<string>();

  const fetchUserId = async (
    projectIdParam: string,
  ): Promise<string | null> => {
    let user: { urn: string } | null = null;
    try {
      user = await getUserId(projectIdParam);
    } catch (error) {
      if (error.response?.status === 404) {
        await createUserId(projectIdParam);
        user = await getUserId(projectIdParam);
      } else {
        return null;
      }
    }
    if (!user?.urn) return null;
    setUserUrn(user.urn);
    return user.urn;
  };

  const fetchPolicy = async (
    projectIdParam: string,
    urn: string,
  ): Promise<string | null> => {
    let policies: { name: string }[];
    try {
      policies = await getPolicy();
    } catch (error) {
      if (error.response?.status === 404) {
        policies = [];
      } else {
        return null;
      }
    }
    const policyName = `call-endpoints-policy-pci-${projectIdParam}`;
    const existingPolicy = policies.find(
      (policy) => policy.name === policyName,
    );
    if (!existingPolicy) {
      await createPolicy(projectIdParam, urn);
    }
    return null;
  };

  useEffect(() => {
    if (!projectId) return;

    const initUserAndPolicy = async () => {
      const urn = await fetchUserId(projectId);
      if (urn) {
        await fetchPolicy(projectId, urn);
      }
    };

    initUserAndPolicy();
  }, [projectId]);

  return { userUrn, fetchUserId, fetchPolicy };
};

export default useUserPolicy;
