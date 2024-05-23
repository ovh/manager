import { ODS_MESSAGE_TYPE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';

import { MutationStatus, useMutationState } from '@tanstack/react-query';
import { patchRancherServiceQueryKey, postRancherServiceQueryKey } from '@/api';
import { RancherService } from '@/api/api.type';
import { EditAction, EditMutationVariables } from '@/hooks/useEditRancher';
import { useTrackingPage } from '@/hooks/useTrackingPage';
import useVersions from '@/hooks/useVersions';
import { COMMON_PATH } from '@/routes';
import { getLatestVersionAvailable } from '@/utils/rancher';
import { TrackingPageView } from '@/utils/tracking';
import Title from '../../Title/Title';
import RancherDetail from './RancherDetail';
import TabBar from './TabBar';
import { useTranslate } from '@/utils/translation';
import LinkIcon from '@/components/LinkIcon/LinkIcon';

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
  const { projectId } = useParams();
  const { t } = useTranslate('pci-rancher/dashboard');
  useTrackingPage(TrackingPageView.DetailRancher);
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);
  const { data: versions } = useVersions();

  const latestVersionAvailable = getLatestVersionAvailable(rancher, versions);
  const mutationEditRancherState = useMutationState<{
    variables: {
      editAction: EditAction;
      rancher: RancherService;
    };
    status: MutationStatus;
  }>({
    filters: { mutationKey: patchRancherServiceQueryKey('').slice(0, 1) },
  });

  const mutationGenerateAccessState = useMutationState({
    filters: {
      mutationKey: postRancherServiceQueryKey('').slice(0, 1),
      status: 'error',
    },
  });

  const editNameResponseType = getResponseStatusByEditAction(
    mutationEditRancherState,
    EditAction.EditName,
  );

  let editNameBannerType = null;

  if (editNameResponseType === 'error') {
    editNameBannerType = ODS_MESSAGE_TYPE.error;
  }

  if (editNameResponseType === 'success') {
    editNameBannerType = ODS_MESSAGE_TYPE.success;
  }

  const updateSoftwareResponseType = getResponseStatusByEditAction(
    mutationEditRancherState,
    EditAction.UpdateSoftware,
  );

  return (
    <>
      <div className="py-4 overflow-hidden text-ellipsis">
        <Title>{rancher.currentState.name}</Title>
      </div>
      <div className="my-4">
        <LinkIcon
          href={hrefPrevious}
          text={t('see_all_rancher')}
          iconName={ODS_ICON_NAME.ARROW_LEFT}
          slot="start"
        />
      </div>

      <TabBar tabs={tabs} />
      <RancherDetail
        latestVersionAvailable={latestVersionAvailable}
        rancher={rancher}
        editNameResponseType={editNameBannerType}
        updateSoftwareResponseType={updateSoftwareResponseType}
        hasErrorAccessDetail={mutationGenerateAccessState.length > 0}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
