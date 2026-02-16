import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQueries } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { MODAL_COLOR, Modal, useNotifications } from '@ovh-ux/muk';

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
        <Text preset={TEXT_PRESET.paragraph}>
          {websiteIds.length === 1
            ? t('managedWordpress:web_hosting_managed_wordpress_delete_website_success_message', {
                website: fqdns[0],
              })
            : t('managedWordpress:web_hosting_managed_wordpress_delete_websites_success_message', {
                website: fqdns.join('; '),
              })}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </Text>,
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
      open
      onOpenChange={onClose}
      type={MODAL_COLOR.critical}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        loading: isPending,
        onClick: () => deleteWebsites({ websiteIds }),
        disabled: websiteIds.length === 0,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      <Text preset={TEXT_PRESET.paragraph}>
        {websiteIds.length === 1
          ? t('common:confirmation_delete_single_site', { website: fqdns[0] })
          : t('common:confirmation_delete_multiple_sites', {
              website: fqdns.join(', '),
            })}
      </Text>
    </Modal>
  );
}
