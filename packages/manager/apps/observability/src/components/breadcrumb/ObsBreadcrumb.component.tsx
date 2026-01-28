import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Breadcrumb as OdsBreadcrumb,
} from '@ovhcloud/ods-react';

import { ObsBreadcrumbProps } from '@/components/breadcrumb/ObsBreadcrumb.props';
import { useObsBreadcrumb } from '@/hooks/breadcrumb/useObsBreadcrumb.hook';
import { breadcrumbConfig } from '@/routes/breadcrumb/Breadcrumb.config';

/**
 * Custom Breadcrumb component for the Observability application
 *
 * Features:
 * - Root item can display an ODS icon
 * - Items can be hidden via configuration
 * - Labels support translation via i18next
 * - Links use react-router for navigation
 * - Route-based configuration with fallback to path-based generation
 *
 * @example
 * // Basic usage with default config
 * <ObsBreadcrumb />
 *
 * @example
 * // With custom configuration
 * <ObsBreadcrumb
 *   config={customBreadcrumbConfig}
 *   translationNamespaces={['breadcrumb', 'tenants']}
 * />
 */
export const ObsBreadcrumb: React.FC<ObsBreadcrumbProps> = ({
  config = breadcrumbConfig,
  translationNamespaces = ['breadcrumb'],
}) => {
  const breadcrumbItems = useObsBreadcrumb({
    config,
    translationNamespaces,
  });

  // Filter out hidden items for rendering
  const visibleItems = breadcrumbItems.filter((item) => !item.hidden);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <OdsBreadcrumb aria-label="Breadcrumb navigation">
      {visibleItems.map((item) => (
        <BreadcrumbItem key={item.key}>
          <BreadcrumbLink
            className="no-underline"
            {...(item.to && { as: RouterLink, to: item.to })}
            {...(item.href && { href: item.href })}
            aria-label={item.ariaLabel}
            aria-current={item.isLast ? 'page' : undefined}
          >
            {item.icon ? <Icon name={item.icon} /> : item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
};

export default ObsBreadcrumb;
