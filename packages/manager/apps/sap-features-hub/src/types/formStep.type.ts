export type StepId = '1' | '2' | '3' | '4' | '5' | '6' | '7';

export type StepFieldData = {
  label: string;
  isSecretValue?: boolean;
  value: any;
  type?: 'data';
};

export type StepFieldSubtitle = {
  type: 'subtitle';
  label: string;
};

export type StepFieldSummary = StepFieldData | StepFieldSubtitle;

export type StepSummary = {
  id: StepId;
  title: string;
  fields: StepFieldSummary[];
};
