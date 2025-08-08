import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { deleteManagedCmsResourceWebsite } from '@/data/api/managedWordpress';

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
  const websiteIds =
    websiteIdsParam.length > 0 ? websiteIdsParam[0].split(',') : [];
  const { addError, addSuccess } = useNotifications();

  const onClose = () => {
    navigate('..');
  };

  const websiteDetails = websiteIds.map((id) => {
    const { data } = useManagedWordpressWebsiteDetails(serviceName, id);
    return data;
  });

  const fqdns = websiteDetails.map(
    (site, index) => site?.currentState.defaultFQDN || websiteIds[index],
  );

  const { mutate: deleteWebsite } = useMutation({
    mutationFn: async ({ websiteId }: { websiteId: string }) => {
      return deleteManagedCmsResourceWebsite(serviceName, websiteId);
    },
    onSuccess: (websiteId: string) => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {websiteIds.length === 1
            ? t(
                'managedWordpress:web_hosting_managed_wordpress_delete_website_success_message',
                { website: fqdns[0] },
              )
            : t(
                'managedWordpress:web_hosting_managed_wordpress_delete_websites_success_message',
                {
                  website: fqdns.join('; '),
                },
              )}
        </OdsText>,
        true,
      );
      queryClient.invalidateQueries({
        queryKey: ['managedWordpressWebsiteDelete', serviceName, websiteId],
      });
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

  const handleDeleteClick = async () => {
    websiteIds.map((websiteId) => deleteWebsite({ websiteId }));
  };
  return (
    <Modal
      heading={
        websiteIds.length === 1
          ? t('delete_my_website')
          : t('delete_my_websites')
      }
      isOpen
      onDismiss={onClose}
      type={ODS_MODAL_COLOR.critical}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      onPrimaryButtonClick={handleDeleteClick}
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
