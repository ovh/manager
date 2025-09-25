import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
} from '@/data/api/managedWordpress';

export default function DeleteModal() {
  const { t } = useTranslation([
    'common',
    'managedWordpress',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const [searchParams] = useSearchParams();
  const websiteIdsParam = searchParams.getAll('websiteIds');
  const websiteIds = websiteIdsParam.length > 0 ? websiteIdsParam[0].split(',') : [];
  const { addError, addSuccess } = useNotifications();

  const onClose = () => {
    navigate('..');
  };

  const websiteQueries = useQueries({
    queries: websiteIds.map((id) => ({
      queryKey: ['get', 'managedCMS', 'resource', serviceName, 'website', id],
      queryFn: () => getManagedCmsResourceWebsiteDetails(serviceName, id),
      enabled: !!serviceName,
    })),
  });

  const websiteDetails = websiteQueries.map((q) => q.data);

  const fqdns = websiteDetails.map(
    (site, index) => site?.currentState.defaultFQDN || websiteIds[index],
  );

  const { mutate: deleteWebsite } = useMutation<void, ApiError, { websiteId: string }>({
    mutationFn: async ({ websiteId }) => {
      await deleteManagedCmsResourceWebsite(serviceName, websiteId);
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
      queryClient
        .invalidateQueries({
          queryKey: ['managedWordpressWebsiteDelete', serviceName],
        })
        .catch(console.error);
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
    onSettled: () => {
      onClose();
    },
  });

  const handleDeleteClick = () => {
    websiteIds.map((websiteId) => deleteWebsite({ websiteId }));
  };
  return (
    <Modal
      heading={websiteIds.length === 1 ? t('delete_my_website') : t('delete_my_websites')}
      isOpen
      onDismiss={onClose}
      type={ODS_MODAL_COLOR.critical}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      onPrimaryButtonClick={() => handleDeleteClick()}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {websiteIds.length === 1
          ? t('confirmation_delete_single_site', { website: fqdns[0] })
          : t('confirmation_delete_multiple_sites', {
              website: fqdns.join('; '),
            })}
      </OdsText>
    </Modal>
  );
}
