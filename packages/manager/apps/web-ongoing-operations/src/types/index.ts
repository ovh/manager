import { ParentEnum } from '@/enum/parent.enum';
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

export interface TArgument {
  acceptedFormats: string[];
  acceptedValues: null;
  description: string;
  fields: string[];
  key: string;
  maximumSize: number;
  minimumSize: null;
  readOnly: boolean;
  template: string;
  type: string;
  value: string;
}

export interface TOperationArguments {
  data: TArgument[];
  actions?: boolean;
}

export interface TFiles {
  key: string;
  data: File[];
}

export interface TServiceInfo {
  contactAdmin: {
    id: string;
  };
}

export interface OngoingOperationDatagridDomainProps {
  parent: ParentEnum;
  props: TOngoingOperations;
}

export interface UploadedArgumentFiles {
  argument: TArgument;
  files: File[];
}

export interface UpdateMeDocumentComponentProps {
  readonly argument: TArgument;
  readonly setUploadedFiles: React.Dispatch<
    React.SetStateAction<UploadedArgumentFiles[]>
  >;
}
