import React from 'react';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { Header } from './header/Header.component';
import { LinkType, Link } from '../Link';
import { BaseLayoutProps } from './BaseLayout.props';

export const BaseLayout = ({
  backLink,
  breadcrumb,
  description,
  subtitle,
  message,
  children,
  header,
  tabs,
}: BaseLayoutProps) => (
  <div className="py-8 px-4 md:py-9 md:px-10 md:mt-2">
    <div>{breadcrumb}</div>
    {header && (
      <div className="my-[24px]">
        <Header {...header} />
      </div>
    )}
    {backLink && (backLink.onClick || backLink.previousPageLink) && (
      <div className="mb-[16px]">
        <Link
          data-testid="manager-back-link"
          onClick={backLink?.onClick}
          type={LinkType.back}
          target="_self"
          href={backLink.previousPageLink}
        >
          {backLink.label}
        </Link>
      </div>
    )}
    {description && (
      <Text className="inline-block mb-[16px]" preset={TEXT_PRESET.span}>
        {description}
      </Text>
    )}
    {message && <div className="mb-5 max-w-[800px]">{message}</div>}
    {subtitle && (
      <Text preset={TEXT_PRESET.heading3} className="block mb-6">
        {subtitle}
      </Text>
    )}
    {tabs && <div className="mb-6">{tabs}</div>}
    {children}
  </div>
);
