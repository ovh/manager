import { LicenseEnum } from '../ApiType';

export type UsageStatisticsParams = {
  from: string;
  to: string;
};

export type UsageStatisticsData = {
  date: string;
  lines: {
    endOfDayCount: number;
    licenceType: LicenseEnum;
    peakCount: number;
  }[];
};
