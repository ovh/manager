import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { useGetProject } from '@/hooks/useGetProject';

type TBreadcrumbItem = {
  label: string;
  href?: string;
};

export type TBreadcrumbProps = {
  items?: TBreadcrumbItem[];
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({ items = [] }) => {
  const backHref = useHref('..');

  const project = useGetProject();

  const breadcrumbItems: TBreadcrumbItem[] = [
    {
      href: project.url,
      label: project.name,
    },
    {
      href: backHref,
      label: 'File Storage',
    },
    ...items,
  ];

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map((item) => (
        <BreadcrumbItem key={item.label}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
};
