import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { Title } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useMutationState } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { patchRancherServiceQueryKey, postRancherServiceQueryKey } from '@/api';
import { RancherService } from '@/api/api.type';
import { useTrackingPage } from '@/hooks/useTrackingPage';
import { COMMON_PATH } from '@/routes';
import { TrackingPageView } from '@/utils/tracking';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  isDisabled?: boolean;
  isComingSoon?: boolean;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
  rancher: RancherService;
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs, rancher }) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { projectId } = useParams();
  useTrackingPage(TrackingPageView.DetailRancher);
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

  const mutationEditNameState = useMutationState({
    filters: { mutationKey: patchRancherServiceQueryKey('').slice(0, 1) },
  });

  const mutationGenerateAccessState = useMutationState({
    filters: {
      mutationKey: postRancherServiceQueryKey('').slice(0, 1),
      status: 'error',
    },
  });

  const editNameResponseStatus = mutationEditNameState.length
    ? mutationEditNameState[0].status
    : null;
  let editNameResponseType = null;

  if (editNameResponseStatus === 'error') {
    editNameResponseType = ODS_MESSAGE_TYPE.error;
  }

  if (editNameResponseStatus === 'success') {
    editNameResponseType = ODS_MESSAGE_TYPE.success;
  }

  return (
    <>
      <div className="py-4 overflow-hidden text-ellipsis">
        <Title>{rancher.currentState.name}</Title>
      </div>
      <OsdsLink
        href={hrefPrevious}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="flex items-center my-6"
      >
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
        <span>{t('see_all_rancher')}</span>
      </OsdsLink>
      <TabBar tabs={tabs} />
      <RancherDetail
        rancher={rancher}
        editNameResponseType={editNameResponseType}
        hasErrorAccessDetail={mutationGenerateAccessState.length > 0}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
