import React from 'react';
import { NavigateFunction } from 'react-router-dom';

import { Headers, HeadersProps } from '../../content';

import { Links, LinksProps } from '../../typography';
export interface DashboardLayoutProps {
  breadcrumb?: React.ReactElement;
  content?: React.ReactElement;
  header?: HeadersProps;
  linkProps?: LinksProps;
  tabs?: React.ReactElement;
  navigate?: NavigateFunction;
}

export const DashboardLayout = ({
  linkProps,
  breadcrumb,
  content,
  navigate,
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
          navigate={navigate}
          href={linkProps.href}
          label={linkProps.label}
          target={linkProps.target}
          type={linkProps.type}
        />
      )}
      <div>{tabs}</div>
      <div className="mt-8">{content}</div>
    </div>
  );
};
