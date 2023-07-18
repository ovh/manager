import React from 'react';
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';

export type PageLayoutProps = React.PropsWithChildren<unknown>;

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
  <section className="px-5 py-4">
    <Breadcrumb />
    {children}
  </section>
);
