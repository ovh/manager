import { ChangeEventHandler, ReactElement, ReactNode } from 'react';

export type RadioCardProps = {
  id: string;
  name: string;
  selected: string;
  isDisabled?: boolean;
  title: string | ReactElement;
  subTitle?: string | ReactElement;
  badges?: ReactElement | null;
  children?: ReactNode;
  onChange: ChangeEventHandler<HTMLInputElement>;
};
