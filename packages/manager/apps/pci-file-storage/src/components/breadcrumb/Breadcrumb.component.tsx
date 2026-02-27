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

  const projectPart = project
    ? {
        href: project?.url,
        label: project?.name ?? '',
      }
    : null;

  const breadcrumbItems: TBreadcrumbItem[] = [
    projectPart,
    {
      href: backHref,
      label: 'File Storage',
    },
    ...items,
  ].filter((part) => !!part);

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
