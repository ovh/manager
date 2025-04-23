import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { ServiceInfoType } from '@/alldoms/enum/service.enum';

interface DatagridColumnDomainNumberProps {
  readonly allDomProperty: ServiceInfoType;
}

export default function DatagridColumnDomainNumber({
  allDomProperty,
}: DatagridColumnDomainNumberProps) {
  const domainLimits = {
    [ServiceInfoType.FrenchInternational]: 8,
    [ServiceInfoType.International]: 5,
    [ServiceInfoType.French]: 3,
  };

  const numberOfAuthorizedDomain = domainLimits[allDomProperty];

  return <DataGridTextCell>{numberOfAuthorizedDomain}</DataGridTextCell>;
}
