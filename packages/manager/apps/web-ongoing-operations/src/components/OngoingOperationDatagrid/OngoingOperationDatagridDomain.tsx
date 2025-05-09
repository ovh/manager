import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useDatagridColumnUrl } from '@/hooks/url/useDatagridColumnUrl';
import {
  domainCreate,
  domainIncomingTransfer,
  domainResourceDelete,
} from '@/constants';

export default function OngoingOperationDatagridDomain({
  parent,
  props,
}: Readonly<OngoingOperationDatagridDomainProps>) {
  const { url, value } = useDatagridColumnUrl({ parent, props });

  return (
    <DataGridTextCell>
      <OdsLink
        href={url}
        label={value}
        data-testid={value}
        isDisabled={
          !url ||
          [domainCreate, domainIncomingTransfer, domainResourceDelete].includes(
            props.function,
          )
        }
      />
    </DataGridTextCell>
  );
}
