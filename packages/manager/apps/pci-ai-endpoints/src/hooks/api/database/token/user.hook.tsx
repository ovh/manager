import { useState } from 'react';
import {
  getUserId,
  createUserId,
  getPolicy,
  createPolicy,
} from '@/data/api/policies/user.api';

const useUserPolicy = () => {
  const [userUrn, setUserUrn] = useState<string>();

  const fetchUserId = async (projectId: string): Promise<string | null> => {
    try {
      let user: { urn: string } | null = null;
      try {
        user = await getUserId(projectId);
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as { response: { status: number } }).response.status === 404
        ) {
          await createUserId(projectId);
          user = await getUserId(projectId);
        } else {
          throw error;
        }
      }

      if (!user?.urn) {
        return null;
      }

      setUserUrn(user.urn);
      return user.urn;
    } catch (error) {
      return null;
    }
  };

  const fetchPolicy = async (
    projectId: string,
    urn: string,
  ): Promise<string | null> => {
    try {
      let policies: { name: string }[];
      try {
        policies = await getPolicy();
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          (error as { response: { status: number } }).response.status === 404
        ) {
          policies = [];
        } else {
          throw error;
        }
      }

      const policyName = `call-endpoints-policy-pci-${projectId}`;
      const existingPolicy = policies.find(
        (policy) => policy.name === policyName,
      );

      if (!existingPolicy) {
        await createPolicy(projectId, urn);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  return { userUrn, fetchUserId, fetchPolicy };
};

export default useUserPolicy;
