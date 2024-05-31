import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { usePciBreadcrumb, BreadcrumbItem } from '@/hooks/useBreadcrumb';

import { useProject } from '@/api/hooks/useProject';

import appConfig from '@/pci-file-storage.config';
import ConfigInterface from '@/configInterface';

export interface BreadcrumbProps {
  customRootLabel?: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

function Breadcrumb({ customRootLabel }: BreadcrumbProps): JSX.Element {
  const myConfig: ConfigInterface = appConfig;
  const label = customRootLabel || myConfig.rootLabel;

  const { projectId } = useParams();
  const { project } = useProject({ projectId });

  if (project) {
    const breadcrumbPci = usePciBreadcrumb({
      projectId,
      appName: label,
    });
    return <OsdsBreadcrumb items={breadcrumbPci} />;
  }
}

export default Breadcrumb;
