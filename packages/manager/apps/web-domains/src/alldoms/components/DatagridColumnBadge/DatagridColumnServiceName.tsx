import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { TServiceDetail } from '@/alldoms/types';
import config from '@/web-domains.config';

interface DatagridColumnServiceNameProps {
  readonly props: TServiceDetail;
}

export default function DatagridColumnServiceName({
  props,
}: DatagridColumnServiceNameProps) {
  const { domain } = props.serviceInfo;
  const { data: url } = useNavigationGetUrl([
    config.rootLabel,
    `/alldoms/${domain}`,
    {},
  ]);

  return (
    <>
      <DataGridTextCell>
        <OdsLink href={`${url}`} label={domain}></OdsLink>
      </DataGridTextCell>
    </>
  );
}
