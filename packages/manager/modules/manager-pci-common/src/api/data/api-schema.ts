import { v6 } from '@ovh-ux/manager-core-api';

export type TApiSchemaResponse = {
  models: {
    'cloud.loadbalancing.PoolAlgorithmEnum': {
      enum: string[];
    };
    'cloud.loadbalancing.PoolProtocolEnum': {
      enum: string[];
    };
    'cloud.loadbalancing.PoolSessionPersistenceTypeEnum': {
      enum: string[];
    };
  };
};

export const getApiSchema = async (): Promise<TApiSchemaResponse> => {
  const { data } = await v6.get<TApiSchemaResponse>(`/cloud.json`);
  return data;
};
