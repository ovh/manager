import React from 'react';
import { Breadcrumb, BreadcrumbProps } from '../Breadcrumb.component';

export type PageLayoutProps = React.PropsWithChildren<
  {
    noBreacrumb?: boolean;
  } & BreadcrumbProps
>;

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  noBreacrumb,
  overviewUrl,
  items,
}) => (
  <section className="px-5 py-4">
    {!noBreacrumb && <Breadcrumb items={items} overviewUrl={overviewUrl} />}
    {children}
  </section>
);
