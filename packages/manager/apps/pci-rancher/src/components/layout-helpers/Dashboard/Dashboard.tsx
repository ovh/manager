import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';
import { COMMON_PATH } from '@/routes';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
import useEditRancherName from '../../../hooks/useEditRancherName';
import useGenerateAccessDetail from '../../../hooks/useGenerateAccessDetail';
import Title from '../../Title/Title';

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
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

  const { editRancherName, editNameResponse } = useEditRancherName({
    projectId: projectId as string,
    rancherId: rancher.id,
  });

  const {
    generateAccesDetail,
    accessDetail,
    hasErrorAccessDetail,
  } = useGenerateAccessDetail({
    projectId: projectId as string,
    rancherId: rancher.id,
  });

  return (
    <>
      <div className="py-4">
        <Title title={rancher.currentState.name} />
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
        editNameResponse={editNameResponse}
        editRancherName={editRancherName}
        generateAccesDetail={generateAccesDetail}
        accessDetail={accessDetail}
        hasErrorAccessDetail={hasErrorAccessDetail}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
