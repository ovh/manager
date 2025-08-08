import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDeleteResourcesTag } from '@/data/hooks/useDeleteResourcesTag';
import { IamResource } from '@/data/api/iam-resources';
import { TrackPageName } from '@/tracking.constant';

export type UnassignTagModalProps = {
  isOpen: boolean;
};

export default function TagDetailUnassign() {
  const { tag } = useParams();
  const { resources } = (useLocation().state as {
    resources: IamResource[];
  }) || { resources: [] };
  const { t } = useTranslation([NAMESPACES.ACTIONS, 'tag-manager']);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { mutate: deleteTag } = useDeleteResourcesTag({
    onSuccess: () => {
      trackPage({
        pageName: TrackPageName.TAG_MANAGEMENT_UNASSIGN_TAG,
        pageType: PageType.bannerSuccess,
      });
      navigate('..');
    },
    onError: () => {
      trackPage({
        pageName: TrackPageName.TAG_MANAGEMENT_UNASSIGN_TAG,
        pageType: PageType.bannerError,
      });
    },
  });

  const unassignTag = () => {
    trackClick({
      actionType: 'action',
      actions: ['pop-up', ButtonType.button, 'unassign-tag', 'confirm'],
    });
    deleteTag({
      resources,
      tagKey: tag.split(':')[0],
    });
  };

  const closeModal = () => {
    trackClick({
      actionType: 'action',
      actions: ['pop-up', ButtonType.button, 'unassign-tag', 'cancel'],
    });
    navigate('..');
  };
  return (
    <Modal
      isOpen={true}
      heading={t('tag-manager:unassignTagModalTitle')}
      type={ODS_MODAL_COLOR.critical}
      onPrimaryButtonClick={unassignTag}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      onDismiss={closeModal}
      onSecondaryButtonClick={closeModal}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
    >
      <OdsText>{t('tag-manager:unassignTagModalDescription', { tag })}</OdsText>
      <ul>
        {resources?.map((resource) => (
          <li key={resource.id}>
            <OdsText>{resource.displayName}</OdsText>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
