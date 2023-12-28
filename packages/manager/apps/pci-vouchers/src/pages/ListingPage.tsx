import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { OdsDatagridColumn } from '@ovhcloud/ods-components/datagrid/dist/types/components';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { OsdsDivider } from '@ovhcloud/ods-components/divider/react';
import { ODS_DIVIDER_SIZE } from '@ovhcloud/ods-components/divider';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/breadcrumb/react';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import Listing from '@/components/Listing';
import useProject from '@/hooks/useProject';
import { useVouchers } from '@/hooks/useVouchers';
import Product from '@/components/Product';
import ValidityTo from '@/components/ValidityTo';
import ValidityFrom from '@/components/ValidityFrom';
import AvailableCredit from '@/components/AvailableCredit';
import TotalCredit from '@/components/TotalCredit';
import GuidesHeader from '@/components/GuidesHeader';
import { Notifications } from '@/components/Notifications';
import reactFormatter from '@/helpers';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const navigation = useNavigation();

  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const { data: vouchers } = useVouchers(projectId || '');

  // const environment = useEnvironment();
  // console.log(environment);
  // console.log(environment.getUserLocale());

  const headers: OdsDatagridColumn[] = [
    {
      title: t('cpb_vouchers_name_cell'),
      field: 'description',
      isSortable: false,
    },
    {
      title: t('cpb_vouchers_products_cell'),
      field: 'products',
      isSortable: true,
      formatter: reactFormatter(<Product></Product>),
    },
    {
      title: t('cpb_vouchers_voucher_cell'),
      field: 'voucher',
      isSortable: true,
    },
    {
      title: t('cpb_vouchers_validity_from_cell'),
      field: 'validity.from',
      isSortable: true,
      formatter: reactFormatter(<ValidityFrom></ValidityFrom>),
    },
    {
      title: t('cpb_vouchers_total_credit_cell'),
      field: 'totalCredit',
      isSortable: true,
      formatter: reactFormatter(<TotalCredit></TotalCredit>),
    },
    {
      title: t('cpb_vouchers_validity_to_cell'),
      field: 'validity.to',
      isSortable: true,
      formatter: reactFormatter(<ValidityTo></ValidityTo>),
    },
    {
      title: t('cpb_vouchers_available_credit_cell'),
      field: 'availableCredit',
      isSortable: true,
      formatter: reactFormatter(<AvailableCredit></AvailableCredit>),
    },
  ];
  const [urlProject, setUrlProject] = useState('');
  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  });

  const hrefAdd = useHref('./add');
  const hrefCredit = useHref('./credit/buy');
  // console.log(OsdsLink);
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
        <GuidesHeader></GuidesHeader>
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
      <div className={'flex mb-3 mt-6'}>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          href={hrefAdd}
        >
          {t('cpb_vouchers_add_button')}
        </OsdsButton>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className={'ml-0.5'}
          href={hrefCredit}
        >
          {t('cpb_vouchers_add_credit_button')}
        </OsdsButton>
      </div>
      {vouchers && (
        <div className={'mt-8'}>
          <Listing headers={headers} items={vouchers} />
        </div>
      )}
      <Outlet />
    </>
  );
}
