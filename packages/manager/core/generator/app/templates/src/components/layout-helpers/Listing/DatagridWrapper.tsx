import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OsdsDatagrid, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import appConfig from '@/{{appName}}.config';
import ConfigInterface from '@/configInterface';
import { ReactFormatter } from '@ovh-ux/manager-core-utils';

interface LinkServiceInterface {
  cellData?: string;
  onClick?: any;
}

interface DatagridWrapperInterface {
  data: any[];
}

function LinkService({ cellData, onClick }: LinkServiceInterface) {
  return (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={() => onClick(cellData)}
    >
      {cellData}
    </OsdsLink>
  );
}

export default function DatagridWrapper({ data }: DatagridWrapperInterface) {
  const navigate = useNavigate();
  const myConfig: ConfigInterface = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const tmp = Object.assign(data, {});
  const keys = Object.keys(tmp[0]);
  const columns = keys
    .filter((element) => element !== 'iam')
    .map((elem) => ({
      title: elem,
      field: elem,
      isSortable: false,
      formatter:
        serviceKey && elem === serviceKey
          ? ReactFormatter(
              <LinkService
                onClick={(cellData: string) => {
                  navigate(`/${cellData}`);
                }}
              />,
            )
          : (value: string) => value,
    }));

  return (
    <>
      {columns && data && data.length > 0 && (
        <OsdsDatagrid
          hasHideableColumns={undefined}
          height={550}
          columns={columns}
          rows={data}
        />
      )}
    </>
  );
}
