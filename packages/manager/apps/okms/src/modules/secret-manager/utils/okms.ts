import { OKMS } from '@/types/okms.type';

export const filterOkmsListByRegion = (okmsList: OKMS[], region: string) => {
  return okmsList.filter((okms) => okms.region === region);
};

type GroupedOkmsList = Record<string, OKMS[]>;

export const groupOkmsListByRegion = (okmsList: OKMS[]): GroupedOkmsList => {
  const okmsListGroupeByRegion = okmsList.reduce<GroupedOkmsList>(
    (acc, okms) => {
      const { region } = okms;
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(okms);
      return acc;
    },
    {},
  );
  return okmsListGroupeByRegion;
};
