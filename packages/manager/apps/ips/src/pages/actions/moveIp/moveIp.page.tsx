import React from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { MESSAGE_COLOR, MessageBody, Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MODAL_TYPE, Modal, ModalProps, useNotifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { useGetIpdetails, useMoveIpService } from '@/data/hooks';
import { ipParkingOptionValue } from '@/types';
import { TRANSLATION_NAMESPACES, fromIdToIp, ipFormatter } from '@/utils';

import Step1 from './components/Step1';
import Step2 from './components/Step2';
import { TOTAL_STEP_NUMBER } from './moveIp.constant';

export default function MoveIpModal() {
  const { id } = useParams<{ id: string }>();
  const { ip, ipGroup } = ipFormatter(fromIdToIp(id));
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { addSuccess } = useNotifications();
  const [destinationService, setDestinationService] = React.useState<string>();
  const [nextHop, setNextHop] = React.useState<string>();
  const [currentStep, setCurrentStep] = React.useState(1);
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.moveIp,
    TRANSLATION_NAMESPACES.common,
    NAMESPACES.ACTIONS,
  ]);

  const closeModal = React.useCallback(() => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['move_additional-ip', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  }, [trackClick, search, navigate]);

  const {
    loading: isIpDetailLoading,
    ipDetails,
    error: ipDetailsError,
  } = useGetIpdetails({
    ip,
    enabled: true,
  });

  const {
    isMoveIpServiceLoading,
    moveIpServiceError,
    hasOnGoingMoveIpTask,
    availableDestinations,
    getNextHopList,
    postMoveIp,
    isMoveIpPending,
    isDedicatedCloudService,
  } = useMoveIpService({
    ip,
    serviceName: ipDetails?.routedTo?.serviceName,
    onMoveIpSuccess: () => {
      addSuccess(
        t('moveIpSuccessMessage', { ip: ipGroup, destinationService }),
      );
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'move_additional-ip_success',
      });
      navigate(`..?${search.toString()}`);
    },
  });

  const error = React.useMemo(() => ipDetailsError || moveIpServiceError, [
    ipDetailsError,
    moveIpServiceError,
  ]);

  const loading = React.useMemo(
    () => isIpDetailLoading || isMoveIpServiceLoading,
    [isIpDetailLoading, isMoveIpServiceLoading],
  );

  const nextHopList = React.useMemo(() => getNextHopList(destinationService), [
    getNextHopList,
    destinationService,
  ]);

  const props: ModalProps = {
    heading: `${t('move', { ns: NAMESPACES.ACTIONS })} Additional IP`,
    step: {
      current: currentStep,
      total: TOTAL_STEP_NUMBER,
    },
    type: MODAL_TYPE.information,
    loading,
    onOpenChange: closeModal,
    primaryButton: {
      label: t(currentStep === 1 ? 'next' : 'confirm', {
        ns: NAMESPACES.ACTIONS,
      }),
      loading: isMoveIpPending,
      disabled:
        !!error ||
        hasOnGoingMoveIpTask ||
        !destinationService ||
        (isDedicatedCloudService(destinationService) && !nextHop),
      onClick: () => {
        if (currentStep === TOTAL_STEP_NUMBER) {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['move_additional-ip', 'confirm'],
          });
          postMoveIp({
            ip,
            to: destinationService,
            nexthop: nextHop,
            serviceName: ipDetails?.routedTo?.serviceName,
          });
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      },
    },
    secondaryButton: {
      label: t(currentStep === 1 || error ? 'cancel' : 'previous', {
        ns: NAMESPACES.ACTIONS,
      }),
      onClick: () => {
        if (currentStep === 1 || error) {
          closeModal();
        } else {
          setCurrentStep((prev) => prev - 1);
        }
      },
    },
  };

  if (error) {
    return (
      <Modal {...props}>
        <ApiErrorMessage error={error} />
      </Modal>
    );
  }

  if (hasOnGoingMoveIpTask) {
    return (
      <Modal {...props}>
        <Message color={MESSAGE_COLOR.critical} dismissible={false}>
          <MessageBody>{t('moveIpOnGoingTaskMessage')}</MessageBody>
        </Message>
      </Modal>
    );
  }

  return (
    <Modal {...props}>
      <React.Suspense>
        {currentStep === 1 && (
          <Step1
            ip={ipGroup}
            currentService={ipDetails?.routedTo?.serviceName}
            availableDestinations={availableDestinations?.data}
            destinationService={destinationService}
            setDestinationService={setDestinationService}
            nextHopList={nextHopList}
            nextHop={nextHop}
            setNextHop={setNextHop}
          />
        )}
        {currentStep === 2 && (
          <Step2
            ip={ipGroup}
            destinationService={
              destinationService === ipParkingOptionValue
                ? t('service_selection_select_ip_parking_option_label')
                : destinationService
            }
            nextHop={nextHop}
          />
        )}
      </React.Suspense>
    </Modal>
  );
}
