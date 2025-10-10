export type Next = {
  action: (id: string) => void;
  label: string | JSX.Element;
  disabled?: boolean;
};

export type Edit = {
  action: (id: string) => void;
  label: string | JSX.Element;
  disabled?: boolean;
};

export type Skip = {
  action: (id: string) => void;
  label: string | JSX.Element;
  disabled?: boolean;
  hint?: string;
};

export type StepProps = {
  id?: string;
  title?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  open: boolean;
  checked: boolean;
  locked: boolean;
  order: number;
  next?: Next;
  edit?: Edit;
  skip?: Skip;
  children?: JSX.Element | JSX.Element[];
};

export default StepProps;
