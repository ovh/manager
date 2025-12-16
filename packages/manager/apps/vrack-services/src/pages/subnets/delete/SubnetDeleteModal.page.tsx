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
import { Modal } from '@ovh-ux/muk';
import {
  MESSAGE_COLOR,
  Text,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useVrackService,
  useUpdateVrackServices,
} from '@ovh-ux/manager-network-common';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function SubnetDeleteModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.subnets,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.common,
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
      open
      heading={t('modalDeleteSubnetHeadline')}
      onOpenChange={onClose}
      primaryButton={{
        label: t('delete', { ns: NAMESPACES.ACTIONS }),
        loading: isPending,
        onClick: () => {
          trackClick({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['delete_subnets', 'confirm'],
          });
          deleteSubnet({ vs, cidrToDelete });
        },
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: onClose,
      }}
      loading={isLoading}
    >
      <Text>{t('modalDeleteSubnetDescription')}</Text>
      {isError && (
        <Message
          dismissible={false}
          className="mb-8"
          color={MESSAGE_COLOR.critical}
        >
          <MessageIcon name="hexagon-exclamation" />
          <MessageBody>
            {t('modalError', {
              error: updateError?.response?.data?.message,
              ns: TRANSLATION_NAMESPACES.common,
            })}
          </MessageBody>
        </Message>
      )}
    </Modal>
  );
}
