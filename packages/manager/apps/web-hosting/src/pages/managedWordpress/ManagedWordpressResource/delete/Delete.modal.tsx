import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';

import {
  deleteManagedCmsResourceWebsite,
  getManagedCmsResourceWebsiteDetails,
  getManagedCmsResourceWebsiteDetailsQueryKey,
  getManagedCmsResourceWebsitesQueryKey,
} from '@/data/api/managedWordpress';
import { useManagedWordpressResourceDetails } from '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails';
import { useManagedWordpressWebsites } from '@/data/hooks/managedWordpress/managedWordpressWebsites/useManagedWordpressWebsites';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';

// for searchbar import { buildURLSearchParams } from '@/utils/url';

interface LocationState {
  websiteIds?: string[];
}
export default function DeleteModal() {
  const { t } = useTranslation([
    'common',
    'managedWordpress',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();

  const { serviceName } = useParams<{ serviceName: string }>();
  const { addError, addSuccess } = useNotifications();
  const { state } = useLocation() as {
    state: LocationState;
  };
  const websiteIds = state?.websiteIds || [];
  const onCloseUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(onCloseUrl);
  const { refetch } = useManagedWordpressWebsites();
  const websiteQueries = useQueries({
    queries: websiteIds.map((id) => ({
      queryKey: getManagedCmsResourceWebsiteDetailsQueryKey(serviceName, id),
      queryFn: () => getManagedCmsResourceWebsiteDetails(serviceName, id),
      enabled: !!serviceName,
    })),
  });
  const websiteDetails = websiteQueries.map((q) => q.data);
  const fqdns = websiteDetails.map(
    (site, index) => site?.currentState?.defaultFQDN || websiteIds[index],
  );
  const { refetch: isRetchDataDetails } = useManagedWordpressResourceDetails(serviceName);
  // for searchbar
  /*  const urlSearchParams = buildURLSearchParams({
    defaultFQDN: fqdns.join(','),
  }); */
  const { mutate: deleteWebsites, isPending } = useMutation<
    void,
    ApiError,
    { websiteIds: string[] }
  >({
    mutationFn: async ({ websiteIds }) => {
      await Promise.all(
        websiteIds.map((websiteId) => deleteManagedCmsResourceWebsite(serviceName, websiteId)),
      );
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {websiteIds.length === 1
            ? t('managedWordpress:web_hosting_managed_wordpress_delete_website_success_message', {
                website: fqdns[0],
              })
            : t('managedWordpress:web_hosting_managed_wordpress_delete_websites_success_message', {
                website: fqdns.join('; '),
              })}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getManagedCmsResourceWebsitesQueryKey(serviceName),
      });
      void refetch();
      void isRetchDataDetails();
      onClose();
    },
  });

  return (
    <Modal
      heading={
        websiteIds.length === 1
          ? t('delete_my_website')
          : t('delete_my_websites', { number: websiteIds.length })
      }
      isOpen
      onDismiss={onClose}
      type={ODS_MODAL_COLOR.critical}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      isPrimaryButtonDisabled={websiteIds.length === 0}
      onPrimaryButtonClick={() => deleteWebsites({ websiteIds })}
      isPrimaryButtonLoading={isPending}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {websiteIds.length === 1
          ? t('confirmation_delete_single_site', { website: fqdns[0] })
          : t('confirmation_delete_multiple_sites', {
              website: fqdns.join(', '),
            })}
      </OdsText>
    </Modal>
  );
}
