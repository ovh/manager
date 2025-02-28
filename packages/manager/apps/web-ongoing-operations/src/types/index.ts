import { TrackingEnum } from '@/enum/tracking.enum';

export interface TOngoingOperations {
  id: number;
  domain?: string;
  zone?: string;
  function: string;
  comment?: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  doneDate?: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TTrackingCurrentStep {
  step:
    | TrackingEnum.Initialisation
    | TrackingEnum.AskForAuthInfo
    | TrackingEnum.ContactConfirmation
    | TrackingEnum.CurrentRegistrarConfirmation
    | TrackingEnum.Finalization;
}

export interface TTracking {
  progress: number;
  taskStatus: string;
  lastUpdateDate: string;
  currentStep: TTrackingCurrentStep;
  expectedDoneDate: string;
  taskActions: string[];
}
