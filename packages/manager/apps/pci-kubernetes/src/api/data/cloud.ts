import { v6 } from '@ovh-ux/manager-core-api';

export type TCloudSchema = {
  models: {
    [key: string]: {
      enum: string[];
    };
  };
};

export const getCloudSchema = async (): Promise<TCloudSchema> => {
  const { data } = await v6.get(`cloud.json`);

  return data;
};
