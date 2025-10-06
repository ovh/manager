import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { toUnicode } from 'punycode';
import { Link } from '@ovhcloud/ods-react';
import { OngoingOperationDatagridDomainProps } from '@/types';
import { useDatagridColumnUrl } from '@/hooks/url/useDatagridColumnUrl';
import { DomainOperationsEnum } from '@/constants';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

export default function OngoingOperationDatagridDomain({
  parent,
  props,
}: Readonly<OngoingOperationDatagridDomainProps>) {
  const { url, value } = useDatagridColumnUrl({ parent, props });
  const { trackDatagridNavivationLink } = useTrackNavigation();

  return (
    <DataGridTextCell>
      <Link
        href={url}
        data-testid={value}
        disabled={
          !url ||
          [
            DomainOperationsEnum.DomainCreate,
            DomainOperationsEnum.DomainIncomingTransfer,
            DomainOperationsEnum.DomainResourceDelete,
          ].includes(props.function as DomainOperationsEnum)
        }
        onClick={() => {
          trackDatagridNavivationLink(url);
        }}
      >
        {toUnicode(value)}
      </Link>
    </DataGridTextCell>
  );
}
