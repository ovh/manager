import {
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { DomainRegistrationStateEnum } from '@/alldoms/enum/service.enum';

interface DomainDatagridColumnDateProps {
  readonly date: string;
  readonly registrationStatus: DomainRegistrationStateEnum;
}

export default function DomainDatagridColumnDate({
  date,
  registrationStatus,
}: DomainDatagridColumnDateProps) {
  const formatDate = useFormatDate();

  if (registrationStatus === DomainRegistrationStateEnum.Unregistered) {
    return '';
  }

  return (
    <DataGridTextCell>
      {formatDate({
        date,
        format: 'P',
      })}
    </DataGridTextCell>
  );
}
