import { v6 } from '@ovh-ux/manager-core-api';

export type TAlert = {
  creationDate: string;
  delay: number;
  id: string;
  monthlyThreshold: number;
  email: string;
  formattedMonthlyThreshold: {
    currencyCode: string;
    text: string;
    value: number;
  };
};

export const createAlert = async (
  projectId: string,
  email: string,
  threshold: number,
): Promise<TAlert> => {
  const { data } = await v6.post<TAlert>(
    `/cloud/project/${projectId}/alerting`,
    {
      email,
      monthlyThreshold: threshold,
      delay: 3600,
    },
  );

  return data;
};

export const updateAlert = async (
  projectId: string,
  alertId: string,
  email: string,
  threshold: number,
): Promise<null> => {
  await v6.put<null>(`/cloud/project/${projectId}/alerting/${alertId}`, {
    email,
    monthlyThreshold: threshold,
    delay: 3600,
  });

  return null;
};

export const getAllAlertIds = async (projectId: string): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `/cloud/project/${projectId}/alerting`,
  );
  return data;
};

export const getAlertById = async (
  projectId: string,
  alertId: string,
): Promise<TAlert> => {
  const { data } = await v6.get<TAlert>(
    `/cloud/project/${projectId}/alerting/${alertId}`,
  );
  return data;
};

export const deleteAlert = async (projectId: string, alertId: string) => {
  await v6.delete(`/cloud/project/${projectId}/alerting/${alertId}`);
};
