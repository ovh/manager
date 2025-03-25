import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { ServiceInfoType } from '@/alldoms/enum/service.enum';
import { TServiceDetail } from '@/alldoms/types';

interface DatagridColumnDomainNumberProps {
  readonly props: TServiceDetail;
}

export default function DatagridColumnDomainNumber({
  props,
}: DatagridColumnDomainNumberProps) {
  let numberOfAuthorizedDomain = 0;
  switch (props.allDomProperty.type) {
    case ServiceInfoType.FrenchInternational:
      numberOfAuthorizedDomain = 8;
      break;
    case ServiceInfoType.International:
      numberOfAuthorizedDomain = 5;
      break;
    default:
      numberOfAuthorizedDomain = 3;
  }
  return <DataGridTextCell>{numberOfAuthorizedDomain}</DataGridTextCell>;
}
