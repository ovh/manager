import { ReactElement, ReactNode } from 'react';

export type HeaderProps = Readonly<{
  title?: ReactNode | null;
  guideMenu?: ReactElement | null;
  changelogButton?: ReactElement | null;
  surveyLink?: ReactElement | null;
}>;
