import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useDatagridColumnUrl } from '@/hooks/url/useDatagridColumnUrl';
import { domainCreate, domainIncomingTransfert } from '@/constants';

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
        target="_blank"
        data-testid={value}
        isDisabled={
          !url ||
          [domainCreate, domainIncomingTransfert].includes(props.function)
        }
      />
    </DataGridTextCell>
  );
}
