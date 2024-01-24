import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { RancherService } from '@/api/api.type';
import { COMMON_PATH } from '@/routes';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
import {
  editRancherService,
  patchRancherServiceQueryKey,
} from '../../../api/GET/apiv2/services';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  isDisabled?: boolean;
  isCommingSoon?: boolean;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
  rancher: RancherService;
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs, rancher }) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const { projectId } = useParams();
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

  const [
    editNameResponse,
    setEditNameResponse,
  ] = useState<ODS_MESSAGE_TYPE | null>(null);
  const { mutate: editRancherName } = useMutation({
    mutationFn: (rancherUpdated: RancherService) =>
      editRancherService({
        rancherId: rancher?.id,
        projectId: projectId as string,
        rancher: rancherUpdated,
      }),
    onSuccess: () => {
      setEditNameResponse(ODS_MESSAGE_TYPE.success);
    },
    onError: () => {
      setEditNameResponse(ODS_MESSAGE_TYPE.error);
    },
    mutationKey: patchRancherServiceQueryKey(rancher?.id),
  });

  return (
    <>
      <div className="py-4">
        <OsdsText
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._600}
        >
          {rancher.currentState.name}
        </OsdsText>
      </div>
      <div className="flex items-center my-6">
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
        <OsdsLink href={hrefPrevious} color={ODS_THEME_COLOR_INTENT.primary}>
          {t('see_all_rancher')}
        </OsdsLink>
      </div>
      <TabBar tabs={tabs} />
      <RancherDetail
        rancher={rancher}
        editNameResponse={editNameResponse}
        editRancherName={editRancherName}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;