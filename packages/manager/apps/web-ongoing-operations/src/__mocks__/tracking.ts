import { TTracking, TOngoingOperations } from '@/types';
import { TrackingEnum } from '@/enum/tracking.enum';

export const trackingDomain: TOngoingOperations[] = [
  {
    id: 7,
    domain: 'case-tracking-initialisation.ovh',
    status: 'doing',
    comment: '"Domain is scheduled for deletion on 2025-02-04 17:28:16"',
    function: 'DomainIncomingTransfer',
    todoDate: '2025-02-04T17:28:16+01:00',
    canCancel: true,
    lastUpdate: '2024-09-03T23:39:32.165934+02:00',
    canRelaunch: false,
    creationDate: '2024-06-04T16:30:02.487036+02:00',
    canAccelerate: false,
  },
];

export const trackingError: TTracking = {
  currentStep: {
    step: TrackingEnum.Initialisation,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 0,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'error',
};

export const trackingInit: TTracking = {
  currentStep: {
    step: TrackingEnum.Initialisation,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 0,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'doing',
};

export const trackingContactConfirmation: TTracking = {
  currentStep: {
    step: TrackingEnum.ContactConfirmation,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 25,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'doing',
};

export const trackingCurrentRegistrarConfirmation: TTracking = {
  currentStep: {
    step: TrackingEnum.CurrentRegistrarConfirmation,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 50,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'doing',
};

export const trackingFinalization: TTracking = {
  currentStep: {
    step: TrackingEnum.Finalization,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 75,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'doing',
};

export const trackingDone: TTracking = {
  currentStep: {
    step: TrackingEnum.Finalization,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 100,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'done',
};

export const trackingAuthError: TTracking = {
  currentStep: {
    step: TrackingEnum.AskForAuthInfo,
  },
  expectedDoneDate: '2025-01-09T14:03:31Z',
  lastUpdateDate: '2024-12-30T14:49:54+01:00',
  progress: 0,
  taskActions: ['canCancel', 'canCorrect'],
  taskStatus: 'error',
};
