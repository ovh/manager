import { ODS_MESSAGE_TYPE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { MutationStatus, useMutationState } from '@tanstack/react-query';
import { patchRancherServiceQueryKey, postRancherServiceQueryKey } from '@/api';
import { RancherService } from '@/api/api.type';
import { EditAction, EditMutationVariables } from '@/hooks/useEditRancher';
import { useTrackingPage } from '@/hooks/useTrackingPage';
import { COMMON_PATH } from '@/routes';
import { TrackingPageView } from '@/utils/tracking';
import Title from '../../Title/Title';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
import { useTranslate } from '@/utils/translation';
import LinkIcon from '@/components/LinkIcon/LinkIcon';
import useVersions from '@/hooks/useVersions';

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

type MutationStateReset = {
  variables: EditMutationVariables;
  status: MutationStatus;
};

const getResponseStatusByEditAction = (
  mutationState: MutationStateReset[],
  editAction: EditAction,
) =>
  mutationState.length && mutationState[0].variables.editAction === editAction
    ? mutationState[0].status
    : null;

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs, rancher }) => {
  const { projectId, rancherId } = useParams();
  const { data: versions } = useVersions();
  const { t } = useTranslate('pci-rancher/dashboard');
  useTrackingPage(TrackingPageView.DetailRancher);
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

  const mutationEditRancherState = useMutationState<{
    variables: {
      editAction: EditAction;
      rancher: RancherService;
    };
    status: MutationStatus;
  }>({
    filters: { mutationKey: patchRancherServiceQueryKey(rancherId) },
  });

  const mutationGenerateAccessState = useMutationState({
    filters: {
      mutationKey: postRancherServiceQueryKey(rancherId),
      status: 'error',
    },
  });

  const editNameResponseType = getResponseStatusByEditAction(
    mutationEditRancherState,
    EditAction.EditName,
  );

  const updateSoftwareResponseType = getResponseStatusByEditAction(
    mutationEditRancherState,
    EditAction.UpdateSoftware,
  );

  let editNameBannerType = null;

  if (editNameResponseType === 'error') {
    editNameBannerType = ODS_MESSAGE_TYPE.error;
  }

  if (editNameResponseType === 'success') {
    editNameBannerType = ODS_MESSAGE_TYPE.success;
  }

  return (
    <>
      <div className="py-4 overflow-hidden text-ellipsis">
        <Title>{rancher.currentState.name}</Title>
      </div>
      <LinkIcon
        href={hrefPrevious}
        text={t('see_all_rancher')}
        iconName={ODS_ICON_NAME.ARROW_LEFT}
        slot="start"
        className="my-4"
      />
      <TabBar tabs={tabs} />
      <RancherDetail
        rancher={rancher}
        versions={versions}
        editNameResponseType={editNameBannerType}
        updateSoftwareResponseType={updateSoftwareResponseType}
        hasErrorAccessDetail={mutationGenerateAccessState.length > 0}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
