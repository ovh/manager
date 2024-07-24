import { v6 } from '@ovh-ux/manager-core-api';

type CloudSchema = {
  models: {
    [key: string]: {
      enum: string[];
    };
  };
};

export const getCloudSchema = async (): Promise<CloudSchema> => {
  const { data } = await v6.get(`cloud.json`);

  return data;
};
