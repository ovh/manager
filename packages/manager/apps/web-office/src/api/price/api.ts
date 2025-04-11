import { v6 } from '@ovh-ux/manager-core-api';

// GET

export const getOfficePrice = async ({
  officeName,
}: {
  officeName: string;
}) => {
  const { data } = await v6.get(`/price/license/office/${officeName}`);
  return data;
};
