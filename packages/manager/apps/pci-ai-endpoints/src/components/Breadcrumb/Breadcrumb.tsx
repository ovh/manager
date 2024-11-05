import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  usePciBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import appConfig from '@/pci-ai-endpoints.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const { projectId } = useParams();
  const { data: project } = useProject();

  if (project) {
    const breadcrumbPci = usePciBreadcrumb({
      projectId,
      appName: 'pci-ai-endpoints',
    });
    return <OsdsBreadcrumb items={breadcrumbPci} />;
  }
}

export default Breadcrumb;
