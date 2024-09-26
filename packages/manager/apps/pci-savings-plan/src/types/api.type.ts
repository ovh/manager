export interface PciProject {
  project_id: string;
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
  DISCOVERY = 'project.discovery',
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

export enum SavingsPlanTaskType {
  SAVINGS_PLAN_UPDATE = 'SAVINGS_PLAN_UPDATE',
  SAVINGS_PLAN_CREATE = 'SAVINGS_PLAN_CREATE',
  SAVINGS_PLAN_DELETE = 'SAVINGS_PLAN_DELETE',
}

export interface SavingsPlanTask {
  id: string;
  type: SavingsPlanTaskType;
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
