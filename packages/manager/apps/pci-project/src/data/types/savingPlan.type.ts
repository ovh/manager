export type SavingsPlan = {
  displayName: string;
  endDate: string;
  flavor: string;
  id: string;
  offerId: string;
  period: string;
  periodEndAction: string;
  periodEndDate: string;
  periodStartDate: string;
  plannedChanges: Array<{
    plannedOn: string;
    properties: {
      status: string;
    };
  }>;
  size: number;
  startDate: string;
  status: string;
};
