import React from 'react';
import { Breadcrumb } from '../Breadcrumb';

export type PageLayoutProps = React.PropsWithChildren<{
  noBreacrumb?: boolean;
}>;

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  noBreacrumb,
}) => (
  <section className="px-5 py-4">
    {!noBreacrumb && <Breadcrumb />}
    {children}
  </section>
);
