import {
  SavingsPlanPlanedChangeStatus,
  SavingsPlanService,
  SavingsPlanStatus,
} from '@/types/api.type';

export const pciSavingsPlanMocked: SavingsPlanService = {
  displayName: 'saving-plan-001',
  model: 'B3-8',
  flavor: 'b3-8',
  endDate: '2024-08-23',
  id: '0dda0458-e425-448a-aa64-ff644cbf3e96',
  offerId: 'urn:fake-saving-plan-offer:1',
  period: 'P6M',
  periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
  periodEndDate: '2024-08-23',
  periodStartDate: '2024-02-23',
  plannedChanges: [
    {
      plannedOn: '2024-08-23',
      properties: {
        status: 'TERMINATED',
      },
    },
  ],
  size: 2,
  startDate: '2024-02-23',
  status: SavingsPlanStatus.ACTIVE,
};

export const pciSavingsPlanListMocked: SavingsPlanService[] = [
  {
    displayName: 'saving-plan-001',
    model: 'B3-8',
    endDate: '2024-08-23',
    id: '0dda0458-e425-448a-aa64-ff644cbf3e96',
    offerId: 'urn:fake-saving-plan-offer:1',
    period: 'P6M',
    flavor: 'Rancher',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
    periodEndDate: '2024-08-23',
    periodStartDate: '2024-02-23',
    plannedChanges: [
      {
        plannedOn: '2024-08-23',
        properties: {
          status: 'TERMINATED',
        },
      },
    ],
    size: 1,
    startDate: '2024-02-23',
    status: SavingsPlanStatus.ACTIVE,
  },
  {
    displayName: 'saving-plan-002',
    model: 'B3-8',
    endDate: '2024-08-23',
    id: '0dda0458-e425-448a-aa64-ff644cbf3e96',
    offerId: 'urn:fake-saving-plan-offer:1',
    period: 'P6M',
    flavor: 'b3-8',
    periodEndAction: SavingsPlanPlanedChangeStatus.TERMINATE,
    periodEndDate: '2024-08-23',
    periodStartDate: '2024-02-23',
    plannedChanges: [
      {
        plannedOn: '2024-08-23',
        properties: {
          status: 'TERMINATED',
        },
      },
    ],
    size: 2,
    startDate: '2024-02-23',
    status: SavingsPlanStatus.TERMINATED,
  },
  {
    displayName: 'saving-plan-003',
    model: 'B3-8',
    endDate: '2024-08-23',
    id: '0dda0458-e425-448a-aa64-ff644cbf3e96',
    offerId: 'urn:fake-saving-plan-offer:1',
    period: 'P6M',
    flavor: 'b3-8',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
    periodEndDate: '2024-08-23',
    periodStartDate: '2024-02-23',
    plannedChanges: [
      {
        plannedOn: '2024-08-23',
        properties: {
          status: 'TERMINATED',
        },
      },
    ],
    size: 5,
    startDate: '2024-02-23',
    status: SavingsPlanStatus.PENDING,
  },
  {
    displayName: 'saving-plan-004',
    model: 'B3-8',
    endDate: '2024-08-23',
    id: '0dda0458-e425-448a-aa64-ff644cbf3e96',
    offerId: 'urn:fake-saving-plan-offer:1',
    period: 'P6M',
    flavor: 'b3-16',
    periodEndAction: SavingsPlanPlanedChangeStatus.REACTIVATE,
    periodEndDate: '2024-08-23',
    periodStartDate: '2024-02-23',
    plannedChanges: [
      {
        plannedOn: '2024-08-23',
        properties: {
          status: 'TERMINATED',
        },
      },
    ],
    size: 2,
    startDate: '2024-02-23',
    status: SavingsPlanStatus.ACTIVE,
  },
];
