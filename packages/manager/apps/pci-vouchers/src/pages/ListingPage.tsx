import { useEffect, useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Datagrid,
  DataGridTextCell,
  useDatagridSearchParams,
  Notifications,
  isDiscoveryProject,
  PciDiscoveryBanner,
  PciGuidesHeader,
} from '@ovhcloud/manager-components';

import {
  OsdsText,
  OsdsDivider,
  OsdsBreadcrumb,
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import { Voucher } from '@/interface';

import useProject from '@/hooks/useProject';
import { useVouchers } from '@/hooks/useVouchers';

import Credit from '@/components/vouchers/listing/Credit';
import DisplayName from '@/components/vouchers/listing/DisplayName';
import Validity from '@/components/vouchers/listing/Validity';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const { t: tError } = useTranslation('error');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const [urlProject, setUrlProject] = useState('');
  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  }, [projectId, navigation]);

  const { data: project } = useProject(projectId || '');

  const columns = [
    {
      id: 'description',
      cell: (props: Voucher) => {
        return <DisplayName voucher={props}></DisplayName>;
      },
      label: t('cpb_vouchers_name_cell'),
    },
    {
      id: 'products',
      cell: (props: Voucher) => {
        return (
          <DataGridTextCell>
            {props.products || t('cpb_vouchers_products_all')}
          </DataGridTextCell>
        );
      },
      label: t('cpb_vouchers_products_cell'),
    },
    {
      id: 'voucher',
      cell: (props: Voucher) => {
        return <DataGridTextCell>{props.voucher}</DataGridTextCell>;
      },
      label: t('cpb_vouchers_voucher_cell'),
    },
    {
      id: 'validityFrom',
      cell: (props: Voucher) => {
        return <Validity date={props.validity.from} />;
      },
      label: t('cpb_vouchers_validity_from_cell'),
    },

    {
      id: 'total_credit',
      cell: (props: Voucher) => {
        return <Credit credit={props.total_credit} />;
      },
      label: t('cpb_vouchers_total_credit_cell'),
    },
    {
      id: 'validityTo',
      cell: (props: Voucher) => {
        return <Validity date={props.validity.to} />;
      },
      label: t('cpb_vouchers_validity_to_cell'),
    },
    {
      id: 'available_credit',
      cell: (props: Voucher) => {
        return <Credit credit={props.available_credit} />;
      },
      label: t('cpb_vouchers_available_credit_cell'),
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const { error, data: vouchers, isLoading } = useVouchers(projectId || '', {
    pagination,
    sorting,
  });

  const hrefAdd = useHref('./add');
  const hrefCredit = useHref('./credit/buy');

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: urlProject,
              label: project.description,
            },
            {
              label: t('cpb_project_management_credit_vouchers'),
            },
          ]}
        ></OsdsBreadcrumb>
      )}
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('cpb_project_management_credit_vouchers')}
        </OsdsText>
        <PciGuidesHeader category="storage"></PciGuidesHeader>
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('cpb_vouchers_add_explain_bis')}
      </OsdsText>
      <OsdsDivider size={ODS_DIVIDER_SIZE.three}></OsdsDivider>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('cpb_vouchers_credit_comment')}
      </OsdsText>

      {isDiscoveryProject(project) && (
        <PciDiscoveryBanner projectId={projectId} />
      )}

      <div className={'flex mb-3 mt-6'}>
        <OsdsButton
          className="mr-1"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={!isDiscoveryProject(project) ? hrefAdd : ''}
          {...(!isDiscoveryProject(project) ? {} : { disabled: true })}
        >
          {t('cpb_vouchers_add_button')}
        </OsdsButton>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className={'ml-0.5'}
          href={!isDiscoveryProject(project) ? hrefCredit : ''}
          {...(!isDiscoveryProject(project) ? {} : { disabled: true })}
        >
          {t('cpb_vouchers_add_credit_button')}
        </OsdsButton>
      </div>

      {error && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.error}>
          {tError('manager_error_page_default')}
        </OsdsMessage>
      )}

      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}

      {!isLoading && !error && (
        <div className={'mt-8'}>
          <Datagrid
            columns={columns}
            items={vouchers?.rows || []}
            totalItems={vouchers?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
