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

export interface OngoingOperationDatagridActionsProps {
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

/**
 * Domain task as returned by APIv2 /domain/name/{domainName}/task — its id is
 * a UUID, unlike the numeric id of the APIv6 /me/task/domain operations.
 */
export interface TDomainTaskV2 {
  id: string;
  type: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TFoaCurrentState = { CHOICE?: string } & Record<string, unknown>;

/**
 * FOA (Form of Authorization) attached to a DomainTrade task.
 * A FOA is still pending while its currentState carries no CHOICE property.
 */
export interface TFoa {
  id: string;
  currentState?: TFoaCurrentState;
}
