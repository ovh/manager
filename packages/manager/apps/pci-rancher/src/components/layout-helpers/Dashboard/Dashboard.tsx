import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import React, { useState, useEffect } from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovhcloud/manager-components';
import { MutationStatus, useMutationState } from '@tanstack/react-query';
import { patchRancherServiceQueryKey, postRancherServiceQueryKey } from '@/api';
import { RancherService } from '@/api/api.type';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import DashboardMessages from './DashboardMessages';
import { EditAction, EditMutationVariables } from '@/hooks/useEditRancher';
import { useTrackingPage } from '@/hooks/useTrackingPage';
import { COMMON_PATH } from '@/routes';
import { TrackingPageView } from '@/utils/tracking';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
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
  const { t } = useTranslation('pci-rancher/dashboard');
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [hasTaskPending, setHasTaskPending] = useState(false);
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

  const { currentTasks } = rancher;

  useEffect(() => {
    if (updateSoftwareResponseType === 'pending') {
      setIsPendingUpdate(true);
    }
  }, [updateSoftwareResponseType]);

  useEffect(() => {
    if (currentTasks.length) {
      setHasTaskPending(true);
    }
  }, [currentTasks]);

  useEffect(() => {
    if (hasTaskPending && currentTasks.length === 0) {
      setIsPendingUpdate(false);
      setHasTaskPending(false);
    }
  }, [currentTasks]);

  let editNameBannerType = null;

  if (editNameResponseType === 'error') {
    editNameBannerType = ODS_MESSAGE_TYPE.error;
  }

  if (editNameResponseType === 'success') {
    editNameBannerType = ODS_MESSAGE_TYPE.success;
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{ title: rancher.currentState.name }}
      tabs={<TabBar tabs={tabs} />}
      backLinkLabel={t('see_all_rancher')}
      hrefPrevious={hrefPrevious}
      message={
        <DashboardMessages
          editNameBannerType={editNameBannerType}
          rancher={rancher}
          isPendingUpdate={isPendingUpdate}
          mutationGenerateAccessState={mutationGenerateAccessState}
          versions={versions}
        />
      }
    >
      <RancherDetail
        rancher={rancher}
        versions={versions}
        editNameResponseType={editNameBannerType}
        updateSoftwareResponseType={updateSoftwareResponseType}
        isPendingUpdate={isPendingUpdate}
      />
      <Outlet />
    </BaseLayout>
  );
};

export default Dashboard;
