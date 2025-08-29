import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import {
  useNotifications,
  Modal,
  ModalProps,
} from '@ovh-ux/manager-react-components';
import { fromIdToIp, ipFormatter, TRANSLATION_NAMESPACES } from '@/utils';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import {
  useGetIpdetails,
  useMoveIpService,
  useServiceList,
} from '@/data/hooks';
import { TOTAL_STEP_NUMBER } from './moveIp.constant';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { ipParkingOptionValue } from '@/types';

export default function MoveIpModal() {
  const { id } = useParams<{ id: string }>();
  const { ip, ipGroup } = ipFormatter(fromIdToIp(id));
  const navigate = useNavigate();
  const { addSuccess } = useNotifications();
  const [destinationService, setDestinationService] = React.useState<string>();
  const [nextHop, setNextHop] = React.useState<string>();
  const [currentStep, setCurrentStep] = React.useState(1);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.moveIp,
    TRANSLATION_NAMESPACES.common,
    NAMESPACES.ACTIONS,
  ]);

  const closeModal = React.useCallback(() => {
    navigate('..');
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
    isLoading: isServiceListLoading,
    vrack,
    error: serviceListError,
  } = useServiceList();

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
    onMoveIpSuccess: () => {
      addSuccess(
        t('moveIpSuccessMessage', { ip: ipGroup, destinationService }),
      );
      closeModal();
    },
  });

  const error = React.useMemo(
    () => ipDetailsError || serviceListError || moveIpServiceError,
    [ipDetailsError, serviceListError, moveIpServiceError],
  );

  const isLoading = React.useMemo(
    () => isIpDetailLoading || isServiceListLoading || isMoveIpServiceLoading,
    [isIpDetailLoading, isServiceListLoading, isMoveIpServiceLoading],
  );

  const nextHopList = React.useMemo(() => getNextHopList(destinationService), [
    getNextHopList,
    destinationService,
  ]);

  const isAttachedToSomeVrack = React.useMemo(
    () => vrack?.some(({ name }) => name === ipDetails?.routedTo?.serviceName),
    [vrack, ipDetails?.routedTo?.serviceName],
  );

  const props: ModalProps = {
    isOpen: true,
    heading: `${t('move', { ns: NAMESPACES.ACTIONS })} Additional IP`,
    currentStep,
    totalStepNumber: TOTAL_STEP_NUMBER,
    type: ODS_MODAL_COLOR.neutral,
    isLoading,
    onDismiss: closeModal,
    isPrimaryButtonLoading: isMoveIpPending,
    isPrimaryButtonDisabled:
      hasOnGoingMoveIpTask ||
      !destinationService ||
      (isDedicatedCloudService(destinationService) && !nextHop),
    primaryLabel: t(currentStep === 1 ? 'next' : 'confirm', {
      ns: NAMESPACES.ACTIONS,
    }),
    secondaryLabel: t(currentStep === 1 ? 'cancel' : 'previous', {
      ns: NAMESPACES.ACTIONS,
    }),
    onPrimaryButtonClick: () => {
      if (currentStep === TOTAL_STEP_NUMBER) {
        postMoveIp({ ip, to: destinationService, nexthop: nextHop });
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    },
    onSecondaryButtonClick: () => {
      if (currentStep === 1) {
        closeModal();
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    },
  };

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
      {error && <ApiErrorMessage error={error} className="mb-4" />}
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
            isCurrentServiceVrack={isAttachedToSomeVrack}
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
