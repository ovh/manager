export interface TOngoingOperations {
  id: string;
  domain: string;
  zone: string;
  function: string;
  comment: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  endDate: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TArgumentData {
  data: TArgument;
}

export interface TArgument {
  acceptedFormats: [];
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

export interface TTrackingCurrentStep {
  step: string;
}

export interface TTracking {
  progress: number;
  taskStatus: string;
  lastUpdateDate: string;
  currentStep: TTrackingCurrentStep;
}
