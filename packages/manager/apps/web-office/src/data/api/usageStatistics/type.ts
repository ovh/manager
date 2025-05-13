export type UsageStatisticsParams = {
  from: string;
  to: string;
};

export type UsageStatisticsData = {
  [x: string]: any;
  date: string;
  lines: {
    endOfDayCount: number;
    licenceType: 'officeBusiness' | 'officeProPlus';
    peakCount: number;
  }[];
};
