import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import {
  useNotifications,
  Modal,
  ModalProps,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { fromIdToIp, ipFormatter, TRANSLATION_NAMESPACES } from '@/utils';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import { useGetIpdetails, useMoveIpService } from '@/data/hooks';
import { TOTAL_STEP_NUMBER } from './moveIp.constant';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { ipParkingOptionValue } from '@/types';

export default function MoveIpModal() {
  const { id } = useParams<{ id: string }>();
  const { ip, ipGroup } = ipFormatter(fromIdToIp(id));
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { addSuccess } = useNotifications();
  const [destinationService, setDestinationService] = React.useState<string>();
  const [destinationError, setDestinationError] = React.useState<string>('');
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
  }, []);

  const {
    isLoading: isIpDetailLoading,
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

  const isLoading = React.useMemo(
    () => isIpDetailLoading || isMoveIpServiceLoading,
    [isIpDetailLoading, isMoveIpServiceLoading],
  );

  const nextHopList = React.useMemo(() => getNextHopList(destinationService), [
    getNextHopList,
    destinationService,
  ]);

  const props: ModalProps = {
    isOpen: true,
    heading: `${t('move', { ns: NAMESPACES.ACTIONS })} Additional IP`,
    step: {
      current: currentStep,
      total: TOTAL_STEP_NUMBER,
    },
    type: ODS_MODAL_COLOR.neutral,
    isLoading,
    onDismiss: closeModal,
    isPrimaryButtonLoading: isMoveIpPending,
    isPrimaryButtonDisabled:
      !!error ||
      !!destinationError ||
      hasOnGoingMoveIpTask ||
      !destinationService ||
      (isDedicatedCloudService(destinationService) && !nextHop),
    primaryLabel: t(currentStep === 1 ? 'next' : 'confirm', {
      ns: NAMESPACES.ACTIONS,
    }),
    secondaryLabel: t(currentStep === 1 || error ? 'cancel' : 'previous', {
      ns: NAMESPACES.ACTIONS,
    }),
    onPrimaryButtonClick: () => {
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
    onSecondaryButtonClick: () => {
      if (currentStep === 1 || error) {
        closeModal();
      } else {
        setCurrentStep((prev) => prev - 1);
      }
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
        <OdsMessage color={ODS_MESSAGE_COLOR.danger} isDismissible={false}>
          {t('moveIpOnGoingTaskMessage')}
        </OdsMessage>
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
            setDestinationError={setDestinationError}
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
