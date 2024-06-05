import React from 'react';

import { Headers, HeadersProps } from '../../content';

import { Links, LinksProps } from '../../typography';
export interface DashboardLayoutProps {
  breadcrumb?: React.ReactElement;
  content?: React.ReactElement;
  header?: HeadersProps;
  linkProps?: LinksProps;
  tabs?: React.ReactElement;
  onClickReturn?: () => void;
}

export const DashboardLayout = ({
  linkProps,
  breadcrumb,
  content,
  onClickReturn,
  header,
  tabs,
}: DashboardLayoutProps) => {
  return (
    <div className="m-8">
      <div className="mb-3">{breadcrumb}</div>
      {header && (
        <Headers
          title={header.title}
          description={header.description}
          headerButton={header.headerButton}
        />
      )}
      {linkProps && (
        <Links
          onClickReturn={onClickReturn}
          href={linkProps.href}
          label={linkProps.label}
          target={linkProps.target}
          type={linkProps.type}
        />
      )}
      <div>{tabs}</div>
      <div>{content}</div>
    </div>
  );
};
