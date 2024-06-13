import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  OsdsLink,
  OsdsMenu,
  OsdsMenuItem,
  OsdsButton,
  OsdsIcon,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  Datagrid,
  DataGridTextCell,
  // useDatagridFilters,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';

import useResourcesIcebergV2 from '@ovhcloud/manager-components/src/hooks/datagrid/useIcebergV2';
import Loading from '@/components/Loading/Loading';
import ErrorBanner from '@/components/Error/Error';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import appConfig from '@/a-vrack-services.config';
import { urls } from '@/routes/routes.constant';

import './listing.scss';

export default function Listing() {
  const { t } = useTranslation('listing');
  const myConfig = appConfig;
  const serviceKey = myConfig.listing?.datagrid?.serviceKey;
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    flattenData,
    isError,
    isLoading,
    error,
    status,
  }: any = useResourcesIcebergV2({
    route: '/iam/policy',
    queryKey: 'servicesListingIcebergIamAction',
  });

  const navigateToDashboard = (label: string) => {
    const path =
      location.pathname.indexOf('pci') > -1 ? `${location.pathname}/` : '/';
    navigate(`${path}${label}`);
  };

  const ActionsMenuCustom = () => {
    return (
      <div>
        <OsdsMenu>
          <OsdsButton
            slot={'menu-title'}
            circle
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.ELLIPSIS}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xxs}
            ></OsdsIcon>
          </OsdsButton>
          <OsdsMenuItem>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                level={ODS_TEXT_LEVEL.button}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot={'start'}
              >
                Reload
              </OsdsText>
            </OsdsButton>
          </OsdsMenuItem>
          <OsdsMenuItem>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                level={ODS_TEXT_LEVEL.button}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot={'start'}
              >
                Reboot
              </OsdsText>
            </OsdsButton>
          </OsdsMenuItem>
          <OsdsMenuItem>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                level={ODS_TEXT_LEVEL.button}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot={'start'}
              >
                Delete
              </OsdsText>
            </OsdsButton>
          </OsdsMenuItem>
        </OsdsMenu>
      </div>
    );
  };

  useEffect(() => {
    if (status === 'success' && data?.pages[0].data.length === 0) {
      navigate(urls.onboarding);
    } else if (status === 'success' && data?.pages.length > 0 && !flattenData) {
      const tmp = Object.keys(data?.pages[0].data[0])
        .filter((element) => element !== 'iam')
        .filter((element) => element !== 'readOnly')
        .filter((element) => element !== 'identities')
        .filter((element) => element !== 'resources')
        .filter((element) => element !== 'permissions')
        .filter((element) => element !== 'permissionsGroups')
        .map((element) => ({
          id: element,
          header: element,
          label: element,
          accessorKey: element,
          cell: (props: any) => {
            const label = props[element] as string;
            if (typeof label === 'string' || typeof label === 'number') {
              if (serviceKey === element)
                return (
                  <DataGridTextCell>
                    <OsdsLink
                      color={ODS_THEME_COLOR_INTENT.primary}
                      onClick={() => navigateToDashboard(label)}
                    >
                      {label}
                    </OsdsLink>
                  </DataGridTextCell>
                );
              return <DataGridTextCell>{label}</DataGridTextCell>;
            }
            return <div>-</div>;
          },
        }));
      const actionCell = {
        id: 'actions',
        header: 'actions',
        label: 'actions',
        accessorKey: 'actions',
        cell: () => (
          <div>
            <ActionsMenuCustom />
          </div>
        ),
      };
      tmp.push(actionCell);
      console.info('tmp : ', tmp);
      // tmp.push(actionCell);
      setColumns(tmp);
    }
  }, [data]);

  if (isError) {
    return <ErrorBanner error={error.response} />;
  }

  if (isLoading && !flattenData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="pt-5 pb-10">
        <Breadcrumb />
        <h2>a-iam</h2>
        <div>{t('title')}</div>
        <React.Suspense>
          {columns && flattenData && (
            <Datagrid
              columns={columns}
              items={flattenData || []}
              totalItems={0}
              // sorting={sorting}
              // onSortChange={setSorting}
              fetchNextPage={fetchNextPage}
              onSortChange={() => {
                console.info('onSortChange !');
              }}
              hasNextPage={hasNextPage}
            />
          )}
        </React.Suspense>
        <div>
          <OsdsLink onClick={() => navigate('/vps')}>Go to VPS</OsdsLink>
        </div>
      </div>
    </>
  );
}
