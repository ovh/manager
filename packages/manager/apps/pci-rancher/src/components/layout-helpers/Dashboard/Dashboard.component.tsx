import { ODS_MESSAGE_TYPE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React from 'react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  OsdsMessage,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ChangelogButton, Title } from '@ovh-ux/manager-react-components';
import { MutationStatus, useMutationState } from '@tanstack/react-query';
import {
  patchRancherServiceQueryKey,
  postRancherServiceQueryKey,
} from '@/data/api/services';
import { RancherService } from '@/types/api.type';
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
import {
  CHANGELOG_LINKS,
  CHANGELOG_CHAPTERS,
} from '@/utils/changelog.constants';
import { PciGuidesHeader } from '@/components/guides-header';

/* 
On va maintenant ajouter une condition à l'affichage de cette bannière : 
S'ils n'existent pas encore, crée un call api et un hook react query pour fetch (via apiV6)  /cloud/project/:projectId/credit/:creditId. Le hook prend en paramètre le creditId, celui-ci est typé via un union type string définit dans le fichier du hook, qui permet de restreindre strictement les valeurs possibles pour le paramètre du hook. Ce type sera de la forme type Tmytype = 'rancher-freetrial'
Le type de retour du endpoint est {
  "available_credit": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "bill": "string",
  "description": "string",
  "id": 0,
  "products": [
    "string"
  ],
  "total_credit": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "used_credit": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "validity": {
    "from": "2026-02-11T15:51:33.183Z",
    "to": "2026-02-11T15:51:33.183Z"
  },
  "voucher": "string"
}
   */

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

const VOUCHER_URL = '#';

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
        data: {
          message: string;
        };
      };
    };
  }>({
    filters: { mutationKey: patchRancherServiceQueryKey(rancherId) },
  });

  const updateError = mutationEditRancherState?.find(
    (state) => state?.status === 'error',
  );

  const errorMessage = updateError?.error?.response?.data?.message;

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
      <div className="py-4 text-ellipsis">
        <div className="flex justify-between align-items-center">
          <Title>{rancher.currentState.name}</Title>
          <div className="flex flex-wrap justify-end gap-1">
            <ChangelogButton
              links={CHANGELOG_LINKS}
              chapters={CHANGELOG_CHAPTERS}
            />
            <PciGuidesHeader />
          </div>
        </div>
      </div>
      <LinkIcon
        href={hrefPrevious}
        text={t('see_all_rancher')}
        iconName={ODS_ICON_NAME.ARROW_LEFT}
        slot="start"
        className="my-4"
      />
      <TabBar tabs={tabs} />
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.info}
        type={ODS_MESSAGE_TYPE.info}
        className="mt-6 max-w-5xl"
      >
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="text-base">
          <Trans
            i18nKey="freeTrialVoucherBanner"
            ns="dashboard"
            components={{
              l: (
                <OsdsLink
                  href={VOUCHER_URL}
                  color={ODS_THEME_COLOR_INTENT.text}
                />
              ),
            }}
          />
        </OsdsText>
      </OsdsMessage>
      <RancherDetail
        rancher={rancher}
        versions={versions}
        editNameResponseType={editNameBannerType}
        updateSoftwareResponseType={updateSoftwareResponseType}
        updateOfferResponseType={updateOfferResponseType}
        updateOfferErrorMessage={errorMessage}
        hasErrorAccessDetail={mutationGenerateAccessState.length > 0}
      />
      <Outlet />
    </>
  );
};

export default Dashboard;
