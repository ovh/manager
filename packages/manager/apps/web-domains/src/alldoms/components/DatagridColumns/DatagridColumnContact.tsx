import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';
import { TServiceInfo } from '@/alldoms/types';

interface DatagridColumnContactProps {
  contacts: TServiceInfo['customer']['contacts'];
  contactType: ServiceInfoContactEnum;
}

export default function DatagridColumnContact({
  contacts,
  contactType,
}: Readonly<DatagridColumnContactProps>) {
  const contact = contacts.find((c) => c.type === contactType);

  return <DataGridTextCell>{contact.customerCode}</DataGridTextCell>;
}
