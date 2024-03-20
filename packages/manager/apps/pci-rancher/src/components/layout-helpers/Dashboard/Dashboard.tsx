import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { RancherService } from '@/api/api.type';
import { COMMON_PATH } from '@/routes';
import useEditRancherName from '../../../hooks/useEditRancherName';
import useGenerateAccessDetail from '../../../hooks/useGenerateAccessDetail';
import Title from '../../Title/Title';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
import { useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingPageView } from '@/utils/tracking';

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
  refetchRancher: () => void;
};

const Dashboard: React.FC<DashboardLayoutProps> = ({
  tabs,
  rancher,
  refetchRancher,
}) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { projectId } = useParams();
  useTrackingPage(TrackingPageView.DetailRancher);
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);
  const [editNameResponseType, setEditNameResponseType] = useState<
    ODS_MESSAGE_TYPE.success | ODS_MESSAGE_TYPE.error | null
  >(null);

  const { mutate: editRancherName } = useEditRancherName({
    projectId: projectId as string,
    rancherId: rancher.id,
    onSuccess: () => {
      setEditNameResponseType(ODS_MESSAGE_TYPE.success);
      refetchRancher();
    },
    onError: () => setEditNameResponseType(ODS_MESSAGE_TYPE.error),
  });

  const {
    generateAccesDetail,
    accessDetail,
    hasErrorAccessDetail,
    onReset,
  } = useGenerateAccessDetail({
    projectId: projectId as string,
    rancherId: rancher.id,
  });

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
        editRancherName={editRancherName}
        generateAccesDetail={generateAccesDetail}
        resetAccessDetail={onReset}
        accessDetail={accessDetail}
        hasErrorAccessDetail={hasErrorAccessDetail}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
