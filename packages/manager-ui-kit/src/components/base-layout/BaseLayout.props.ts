import { PropsWithChildren, ReactElement } from 'react';
import { HeaderProps } from './header/Header.props';

export type BaseLayoutProps = PropsWithChildren<{
  breadcrumb?: ReactElement;
  header?: HeaderProps;
  message?: ReactElement;
  description?: string;
  subtitle?: string;
  backLink?: {
    label: string;
    onClick?: () => void;
    previousPageLink?: string;
  };
  tabs?: ReactElement;
}>;
