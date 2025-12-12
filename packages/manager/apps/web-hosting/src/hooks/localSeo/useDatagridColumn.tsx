import React, { useContext, useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BUTTON_VARIANT, Badge, ICON_NAME } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, ActionMenuItemProps, DatagridColumn } from '@ovh-ux/muk';

import { LOCAL_SEO_INTERFACE } from '@/constants';
import {
  useGetHostingLocalSeoAccount,
  useHostingLocalSeoLogin,
} from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';
import { LocalSeoType } from '@/data/types/product/seo';
import { subRoutes, urls } from '@/routes/routes.constants';

import { EmailCell } from './EmailCell';

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

  const items: ActionMenuItemProps[] = [
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
    <ActionMenu
      id={props?.accountId?.toString()}
      items={items}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      icon={ICON_NAME.ellipsisVertical}
    />
  );
};

export default function useDatagridColumn() {
  const { t } = useTranslation(['local-seo', NAMESPACES.STATUS]);
  const { serviceName } = useParams();

  const columns: DatagridColumn<LocalSeoType>[] = useMemo(() => {
    const StatusColor = {
      created: BADGE_COLOR.success,
      creating: BADGE_COLOR.warning,
      deleting: BADGE_COLOR.critical,
      updating: BADGE_COLOR.information,
    };

    return [
      {
        id: 'name',
        accessorKey: 'name',
        cell: ({ row }) => <div>{row.original.name}</div>,
        header: t('hosting_tab_LOCAL_SEO_table_header_name'),
      },
      {
        id: 'address',
        accessorKey: 'address',
        cell: ({ row }) => (
          <div>
            {row.original.address ? (
              row.original.address
            ) : (
              <Badge className="my-3" color={BADGE_COLOR.information}>
                {t('hosting_tab_LOCAL_SEO_table_value_undefined')}
              </Badge>
            )}
          </div>
        ),
        header: t('hosting_tab_LOCAL_SEO_table_header_address'),
      },
      {
        id: 'email',
        accessorKey: 'accountId',
        cell: ({ row }) => (
          <EmailCell
            serviceName={serviceName}
            accountId={row.original.accountId?.toString() || ''}
          />
        ),
        header: t('hosting_tab_LOCAL_SEO_table_header_email'),
      },
      {
        id: 'status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <div className="w-10">
            <Badge className="my-3" color={StatusColor[row.original.status]}>
              {t(`hosting_tab_LOCAL_SEO_state_${row.original.status}`)}
            </Badge>
          </div>
        ),
        header: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'actions',
        header: '',
        size: 48,
        isSortable: false,
        cell: ({ row }) => <DatagridActionCell {...row.original} />,
      },
    ];
  }, [serviceName, t]);

  return columns;
}
