import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';
import { toUnicode } from 'punycode';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useDatagridColumnUrl } from '@/hooks/url/useDatagridColumnUrl';
import { DomainOperations, DomainOperationsEnum } from '@/constants';

export default function OngoingOperationDatagridDomain({
  parent,
  props,
}: Readonly<OngoingOperationDatagridDomainProps>) {
  const { url, value } = useDatagridColumnUrl({ parent, props });

  return (
    <DataGridTextCell>
      <OdsLink
        href={url}
        label={toUnicode(value)}
        data-testid={value}
        isDisabled={
          !url ||
          [
            DomainOperationsEnum.DomainCreate,
            DomainOperationsEnum.DomainIncomingTransfer,
            DomainOperationsEnum.DomainResourceDelete,
          ].includes(props.function as DomainOperationsEnum)
        }
      />
    </DataGridTextCell>
  );
}
