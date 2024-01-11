import { useEffect, useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  OsdsText,
  OsdsDivider,
  OsdsBreadcrumb,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import useProject from '@/hooks/useProject';
import { useVouchers } from '@/hooks/useVouchers';

import GuidesHeader from '@/components/guides/GuidesHeader';
import { Notifications } from '@/components/Notifications';
import VouchersListing from '@/components/vouchers/VouchersListing';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const navigation = useNavigation();

  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const { data: vouchers, isLoading } = useVouchers(projectId || '');

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

      {!isLoading && (
        <div className={'mt-8'}>
          <VouchersListing vouchers={vouchers || []} />
        </div>
      )}

      <Outlet />
    </>
  );
}
