import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import {
  usePciBreadcrumb,
  BreadcrumbItem,
} from '@/hooks/breadcrumb/useBreadcrumb';
import { useProject } from '@/data/hooks/pci/useProject';
import appConfig from '@/pci-ai-endpoints.config';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const label = customRootLabel || appConfig.rootLabel;

  const { projectId } = useParams();
  const { project } = useProject({ projectId });

  if (project) {
    const breadcrumbPci = usePciBreadcrumb({
      projectId,
      appName: 'pci-ai-endpoints',
    });
    return <OsdsBreadcrumb items={breadcrumbPci} />;
  }
}

export default Breadcrumb;
