import { useCallback, useEffect, useState } from 'react';
import { useHref } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { MutationStatus } from '@tanstack/react-query';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  RancherPlanName,
  RancherService,
  RancherVersion,
  ResourceStatus,
} from '@/types/api.type';
import { useTrackingAction } from '@/hooks/useTrackingPage/useTrackingPage';
import {
  getI18nextDriverError,
  getLatestVersionAvailable,
} from '@/utils/rancher';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

export interface UseRancherDetailParams {
  rancher: RancherService;
  editNameResponseType: ODS_MESSAGE_TYPE | null;
  updateSoftwareResponseType: MutationStatus;
  updateOfferResponseType: MutationStatus;
  updateOfferErrorMessage?: string;
  versions: RancherVersion[];
}

export const useRancherDetail = ({
  rancher,
  editNameResponseType,
  updateSoftwareResponseType,
  updateOfferResponseType,
  updateOfferErrorMessage,
  versions,
}: UseRancherDetailParams) => {
  const { t, i18n } = useTranslation([
    'dashboard',
    'updateSoftware',
    'listing',
  ]);
  const trackAction = useTrackingAction();
  const { addError, addInfo, clearNotifications } = useNotifications();

  const hrefEdit = useHref('./edit');
  const hrefUpdateSoftware = useHref('./update-software');
  const hrefGenerateAccess = useHref('./generate-access');
  const hrefUpdateOffer = useHref('./update-offer');

  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isPendingOffer, setIsPendingOffer] = useState(false);
  const [hasTaskPending, setHasTaskPending] = useState(false);

  const { resourceStatus, currentState, currentTasks } = rancher;
  const { name, version, plan, url } = currentState;

  const dateUsage = currentState.usage
    ? new Date(currentState.usage.datetime)
    : null;
  const computedStatus =
    isPendingUpdate || isPendingOffer
      ? ResourceStatus.UPDATING
      : resourceStatus;
  const isReadyStatus = computedStatus === ResourceStatus.READY;
  const shouldDisplayUpdateSoftware =
    getLatestVersionAvailable(rancher, versions) &&
    isReadyStatus &&
    !updateSoftwareResponseType;
  const isEligibleForUpgrade = plan === RancherPlanName.OVHCLOUD_EDITION;
  const iamEnabled =
    rancher.currentState.iamAuthEnabled || rancher.targetSpec.iamAuthEnabled;
  const userLocale = getDateFnsLocale(i18n.language);

  useEffect(() => {
    if (updateOfferErrorMessage) {
      const driverError = getI18nextDriverError(updateOfferErrorMessage);
      addError(
        driverError
          ? t(...driverError)
          : t('updateOfferError', { errorMessage: updateOfferErrorMessage }),
      );
    }
  }, [updateOfferErrorMessage, addError, t]);

  useEffect(() => {
    if (updateSoftwareResponseType === 'pending') {
      setIsPendingUpdate(true);
    }
    if (updateOfferResponseType === 'pending') {
      setIsPendingOffer(true);
    }
  }, [updateSoftwareResponseType, updateOfferResponseType]);

  useEffect(() => {
    if (currentTasks.length) {
      addInfo(t('updateOfferPending'));
      setHasTaskPending(true);
    }
  }, [currentTasks, addInfo, t]);

  useEffect(() => {
    if (hasTaskPending && currentTasks.length === 0) {
      setIsPendingUpdate(false);
      setHasTaskPending(false);
      setIsPendingOffer(false);
    }
    if (currentTasks.length === 0) {
      clearNotifications();
    }
  }, [currentTasks, hasTaskPending, clearNotifications]);

  const displayDate = useCallback(
    (formatString: string) =>
      dateUsage &&
      format(new Date(dateUsage), formatString, {
        locale:
          userLocale in locales
            ? locales[userLocale as keyof typeof locales]
            : locales.fr,
      }),
    [userLocale, dateUsage],
  );

  const onAccessRancherUrl = useCallback(() => {
    trackAction(TrackingPageView.DetailRancher, TrackingEvent.accessUi);
  }, [trackAction]);

  return {
    name,
    version,
    plan,
    url,
    dateUsage,
    rancher,
    computedStatus,
    isReadyStatus,
    shouldDisplayUpdateSoftware,
    isEligibleForUpgrade,
    iamEnabled,
    hrefEdit,
    hrefUpdateSoftware,
    hrefGenerateAccess,
    hrefUpdateOffer,
    isPendingUpdate,
    editNameResponseType,
    displayDate,
    onAccessRancherUrl,
    t,
  };
};
