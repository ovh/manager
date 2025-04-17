export type StepId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type StepFieldData = {
  label: string;
  isSecretValue?: boolean;
  value: any;
  type?: 'data';
};

export type StepFieldLabel = {
  type: 'subtitle';
  isMinor?: boolean;
  label: string;
};

export type StepFieldSummary = StepFieldData | StepFieldLabel;

export type StepSummary = {
  id: StepId;
  title: string;
  fields: StepFieldSummary[];
};
