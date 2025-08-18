import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import { Link } from '@ovhcloud/ods-react';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useDatagridColumnUrl } from '@/hooks/url/useDatagridColumnUrl';
import { DomainOperationsEnum } from '@/constants';

export default function OngoingOperationDatagridDomain({
  parent,
  props,
}: Readonly<OngoingOperationDatagridDomainProps>) {
  const { url, value } = useDatagridColumnUrl({ parent, props });

  return (
    <DataGridTextCell>
      <Link
        href={url}
        data-testid={value}
        isDisabled={
          !url ||
          [
            DomainOperationsEnum.DomainCreate,
            DomainOperationsEnum.DomainIncomingTransfer,
            DomainOperationsEnum.DomainResourceDelete,
          ].includes(props.function as DomainOperationsEnum)
        }
      >
        {toUnicode(value)}
      </Link>
    </DataGridTextCell>
  );
}
