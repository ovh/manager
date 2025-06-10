import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useOvhTracking,
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@ovh-ux/manager-react-components';
import { OdsText, OdsMessage } from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useVrackService,
  useUpdateVrackServices,
} from '@ovh-ux/manager-network-common';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { getDisplayName } from '@/utils/vrack-services';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function SubnetDeleteModal() {
  const { t } = useTranslation([
    'vrack-services/subnets',
    NAMESPACES.ACTIONS,
    'vrack-services',
  ]);
  const { id, cidr } = useParams();
  const cidrToDelete = cidr.replace('_', '/');
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackPage, trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_subnets', 'cancel'],
    });
    navigate('..');
  };

  const { data: vs, isLoading } = useVrackService();
  const {
    deleteSubnet,
    isPending,
    updateError,
    isError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteSubnet,
      });
      navigate('..');
      addSuccessMessage(
        t('subnetDeleteSuccess', {
          id: getDisplayName(vs),
          cidr: cidrToDelete,
        }),
        { vrackServicesId: id },
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteSubnet,
      });
    },
  });

  return (
    <Modal
      isOpen
      heading={t('modalDeleteSubnetHeadline')}
      onDismiss={onClose}
      onSecondaryButtonClick={onClose}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      primaryLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_subnets', 'confirm'],
        });
        deleteSubnet({ vs, cidrToDelete });
      }}
      isPrimaryButtonLoading={isPending}
      isLoading={isLoading}
    >
      <OdsText>{t('modalDeleteSubnetDescription')}</OdsText>
      {isError && (
        <OdsMessage
          isDismissible={false}
          className="block mb-8"
          color={ODS_MESSAGE_COLOR.critical}
        >
          {t('modalError', {
            error: updateError?.response?.data?.message,
            ns: 'vrack-services',
          })}
        </OdsMessage>
      )}
    </Modal>
  );
}
