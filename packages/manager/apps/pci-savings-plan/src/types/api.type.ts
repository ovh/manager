export interface PciProject {
  projectId: string;
  projectName: string;
  description: string;
  planCode: PciProjectPlanCode;
  access: string;
  creationDate: string;
  serviceId: number;
  unleash: boolean;
  status: string;
}

export enum PciProjectPlanCode {
  STANDARD = 'project.2018',
}

export enum SavingsPlanStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED',
}

export enum SavingsPlanPlanedChangeStatus {
  REACTIVATE = 'REACTIVATE',
  TERMINATE = 'TERMINATE',
}

export interface SavingsPlanContract {
  name: string;
  content: string;
  url: string;
}

export interface SavingsPlanService {
  id: string;
  model: string;
  flavor: string;
  displayName: string;
  offerId: string;
  endDate: string;
  period: string;
  periodEndAction: SavingsPlanPlanedChangeStatus;
  periodEndDate: string;
  periodStartDate: string;
  plannedChanges: [
    {
      plannedOn: string;
      properties: {
        status: string;
      };
    },
  ];
  size: number;
  startDate: string;
  status: SavingsPlanStatus;
}

export type UseSavingsPlanParams = {
  savingsPlanId: string;
  onSuccess?: () => void;
};
