import { ODS_MESSAGE_TYPE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Title } from '@ovh-ux/manager-react-components';
import { MutationStatus, useMutationState } from '@tanstack/react-query';
import {
  patchRancherServiceQueryKey,
  postRancherServiceQueryKey,
} from '@/data/api/services';
import { OVHError, RancherService } from '@/types/api.type';
import {
  EditAction,
  EditMutationVariables,
} from '@/data/hooks/useEditRancher/useEditRancher';
import { useTrackingPage } from '@/hooks/useTrackingPage/useTrackingPage';
import { COMMON_PATH } from '@/routes/routes';
import { TrackingPageView } from '@/utils/tracking';
import RancherDetail from './RancherDetail/RancherDetail.component';
import TabBar from './TabBar/TabBar.component';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';
import useVersions from '@/data/hooks/useVersions/useVersions';

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
  const { t } = useTranslation('dashboard');
  useTrackingPage(TrackingPageView.DetailRancher);
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

  const mutationEditRancherState = useMutationState<{
    variables: {
      editAction: EditAction;
      rancher: RancherService;
    };
    status: MutationStatus;
    error: {
      response: {
        data: OVHError;
      };
    };
  }>({
    filters: { mutationKey: patchRancherServiceQueryKey(rancherId) },
  });

  const updateError = mutationEditRancherState?.find(
    (state) => state?.status === 'error',
  );

  const errorMessage = updateError?.error?.response?.data;

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

  const updateOfferResponseType = getResponseStatusByEditAction(
    mutationEditRancherState,
    EditAction.UpdateOffer,
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
        updateOfferResponseType={updateOfferResponseType}
        updateOfferError={errorMessage}
        hasErrorAccessDetail={mutationGenerateAccessState.length > 0}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
