import React from 'react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

export type BreadcrumbComponentProps = {
  breadcrumbs: ReturnType<typeof useBreadcrumbs>;
};

export default function BreadcrumbComponent({
  breadcrumbs,
}: BreadcrumbComponentProps): JSX.Element {
  const items = breadcrumbs.filter(({ match }) => match.pathname !== '/');
  const count = items.length;
  // no need to display a breadcrumb for a single item
  if (count <= 1) {
    return <></>;
  }
  return (
    <Breadcrumb>
      {items.map(({ match, breadcrumb }, index) => (
        <BreadcrumbItem key={match.pathname}>
          {index + 1 < count ? (
            <BreadcrumbLink as={Link} to={match.pathname}>
              {breadcrumb}
            </BreadcrumbLink>
          ) : (
            <span>{breadcrumb}</span>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
