import React, { useContext } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ActionMenu,
  ActionMenuItem,
  Badge,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { LOCAL_SEO_INTERFACE } from '@/constants';
import {
  useGetHostingLocalSeoAccount,
  useHostingLocalSeoLogin,
} from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';
import { LocalSeoType } from '@/data/types/product/seo';
import { subRoutes, urls } from '@/routes/routes.constants';

export const DatagridActionCell = (props: LocalSeoType) => {
  const { t } = useTranslation('local-seo');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { serviceName } = useParams();
  const navigate = useNavigate();
  let interfaceLink = LOCAL_SEO_INTERFACE;
  const { hostingLocalSeoLogin } = useHostingLocalSeoLogin(serviceName);

  const onOpenInterface = async () => {
    const newWindow = window.open('', '_blank');
    const token = await hostingLocalSeoLogin(String(props?.accountId));
    interfaceLink = LOCAL_SEO_INTERFACE.replace('{lang}', ovhSubsidiary.toLowerCase()).replace(
      '{token}',
      token,
    );
    if (newWindow) {
      newWindow.location.href = interfaceLink;
    }
  };

  const { data } = useGetHostingLocalSeoAccount(serviceName, props?.accountId?.toString());
  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('hosting_tab_LOCAL_SEO_access_interface'),
      onClick: () => {
        onOpenInterface().catch(console.error);
      },
    },
    {
      id: 2,
      label: t('hosting_tab_LOCAL_SEO_delete'),
      onClick: () => {
        navigate(
          urls.removeSeoSubsciption
            .replace(subRoutes.serviceName, serviceName)
            .replace(subRoutes.locationId, props?.id?.toString()),
          {
            state: {
              companyName: props?.name,
              address: props?.address,
              email: data?.email,
            },
          },
        );
      },
    },
  ];

  return (
    <DataGridTextCell>
      <ActionMenu
        id={props?.accountId?.toString()}
        items={items}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
      />
    </DataGridTextCell>
  );
};

export default function useDatagridColumn() {
  const { t } = useTranslation(['local-seo', NAMESPACES.STATUS]);
  const { serviceName } = useParams();

  const StatusColor = {
    created: ODS_BADGE_COLOR.success,
    creating: ODS_BADGE_COLOR.warning,
    deleting: ODS_BADGE_COLOR.critical,
    updating: ODS_BADGE_COLOR.information,
  };

  const columns = [
    {
      id: 'name',
      cell: (props: LocalSeoType) => <DataGridTextCell>{props?.name}</DataGridTextCell>,
      label: t('hosting_tab_LOCAL_SEO_table_header_name'),
    },
    {
      id: 'address',
      cell: (props: LocalSeoType) => (
        <DataGridTextCell>
          {props?.address ? (
            props.address
          ) : (
            <Badge
              label={t('hosting_tab_LOCAL_SEO_table_value_undefined')}
              className="my-3"
              color={ODS_BADGE_COLOR.information}
            />
          )}
        </DataGridTextCell>
      ),
      label: t('hosting_tab_LOCAL_SEO_table_header_address'),
    },
    {
      id: 'email',
      cell: function EmailCell(props: LocalSeoType) {
        const { data } = useGetHostingLocalSeoAccount(serviceName, props?.accountId?.toString());
        return <DataGridTextCell>{data?.email}</DataGridTextCell>;
      },
      label: t('hosting_tab_LOCAL_SEO_table_header_email'),
    },
    {
      id: 'status',
      cell: (props: LocalSeoType) => (
        <DataGridTextCell className="w-10">
          <Badge
            label={t(`hosting_tab_LOCAL_SEO_state_${props?.status}`)}
            className="my-3"
            color={StatusColor[props?.status]}
          />
        </DataGridTextCell>
      ),
      label: t(t(`${NAMESPACES.STATUS}:status`)),
    },
    {
      id: 'actions',
      label: '',
      isSortable: false,
      cell: DatagridActionCell,
    },
  ];

  return columns;
}
