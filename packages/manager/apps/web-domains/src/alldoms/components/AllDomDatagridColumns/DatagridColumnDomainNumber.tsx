import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { ServiceInfoType } from '@/alldoms/enum/service.enum';

interface DatagridColumnDomainNumberProps {
  readonly allDomType: ServiceInfoType;
}

export default function DatagridColumnDomainNumber({
  allDomType,
}: DatagridColumnDomainNumberProps) {
  const domainLimits = {
    [ServiceInfoType.FrenchInternational]: 8,
    [ServiceInfoType.International]: 5,
    [ServiceInfoType.French]: 3,
  };

  const numberOfAuthorizedDomain = domainLimits[allDomType];

  return <DataGridTextCell>{numberOfAuthorizedDomain}</DataGridTextCell>;
}
