import React, { useMemo } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { MODAL_COLOR, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { deleteZimbraPlatformRedirection, getZimbraPlatformRedirectionsQueryKey } from '@/data/api';
import { useRedirections } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import {
  CANCEL,
  CONFIRM,
  DELETE_REDIRECTION,
  EMAIL_ACCOUNT_DELETE_REDIRECTION,
} from '@/tracking.constants';

export const DeleteOrganizationModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['redirections', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const location = useLocation();
  const { addSuccess, addError } = useNotifications();
  const { platformId, accountId, redirectionId } = useParams();
  const { data: allRedirections, isLoading } = useRedirections({
    enabled: !!redirectionId,
  });

  const redirections = useMemo(() => {
    let {
      selectedRedirections,
    }: {
      selectedRedirections: Array<{ id: string; from: string; to: string }>;
    } = location.state || {};
    const redirection = allRedirections?.find((r) => r.id === redirectionId);
    if (redirection && !selectedRedirections) {
      selectedRedirections = [
        {
          id: redirection.id,
          from: redirection?.currentState?.source,
          to: redirection?.currentState?.destination,
        },
      ];
    }
    return selectedRedirections ?? [];
  }, [location.state, redirectionId, allRedirections]);

  const trackingName = accountId ? EMAIL_ACCOUNT_DELETE_REDIRECTION : DELETE_REDIRECTION;

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = (clear: boolean) =>
    navigate(goBackUrl, { state: { clearSelectedRedirections: clear } });

  const { mutate: deleteRedirections, isPending: isSending } = useMutation({
    mutationFn: () => {
      return Promise.all(
        redirections.map((r) => deleteZimbraPlatformRedirection(platformId, r.id)),
      );
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_delete_success_message')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformRedirectionsQueryKey(platformId),
      });

      onClose(true);
    },
  });

  const handleConfirmClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    deleteRedirections();
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });
    onClose(false);
  };

  return (
    <Modal
      type={MODAL_COLOR.critical}
      heading={redirectionId ? t('common:delete_redirection') : t('common:delete_redirections')}
      open
      loading={isSending || isLoading}
      onOpenChange={() => onClose(false)}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        onClick: handleConfirmClick,
        loading: isSending,
        testId: 'delete-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
        testId: 'cancel-btn',
      }}
    >
      <>
        <Text preset={TEXT_PRESET.paragraph} className="my-5" data-testid="modal-content">
          {t('zimbra_redirections_delete_modal_content')}
        </Text>
        {redirections.map((item) => (
          <div className="flex gap-6" key={item?.id}>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_redirections_from')}
              {': '}
              {item?.from}
            </Text>

            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_redirections_to')}
              {': '}
              {item?.to}
            </Text>
          </div>
        ))}
      </>
    </Modal>
  );
};

export default DeleteOrganizationModal;
