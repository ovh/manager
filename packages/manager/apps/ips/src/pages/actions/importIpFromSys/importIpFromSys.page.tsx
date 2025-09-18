import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { TRANSLATION_NAMESPACES } from '@/utils';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import { useOrderIpMigration } from '@/data/hooks';
import { TOTAL_STEP_NUMBER } from './importIpFromSys.constant';
import './importIpFromSys.scss';

export default function ImportIpFromSys() {
  const { addSuccess } = useNotifications();
  const [ip, setIp] = React.useState<string>();
  const [token, setToken] = React.useState<string>();
  const [destinationServer, setDestinationServer] = React.useState<string>();
  const [duration, setDuration] = React.useState<string>();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [search] = useSearchParams();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.importIpFromSys,
    NAMESPACES.FORM,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const {
    mutate: postIpMigrationOrder,
    data: ipMigrationOrderData,
    isPending: isIpMigrationOrderPending,
    error: ipMigrationOrderError,
  } = useOrderIpMigration({
    ip,
    token,
    serviceName: destinationServer,
    duration,
    onSuccess: () => setCurrentStep(() => 5),
  });

  return (
    <OdsModal
      isOpen
      onOdsClose={closeModal}
      color={ODS_MODAL_COLOR.neutral}
      isDismissible
      className="import-ip-from-sys-modal"
    >
      <div className="flex items-center">
        <OdsText
          className="block mb-4 mr-3 flex-1"
          preset={ODS_TEXT_PRESET.heading3}
        >
          {t('title')}
        </OdsText>
        <OdsText className="ml-auto" preset={ODS_TEXT_PRESET.caption}>
          {t('stepPlaceholder', {
            current: currentStep,
            total: TOTAL_STEP_NUMBER,
            ns: NAMESPACES.FORM,
          })}
        </OdsText>
      </div>
      <React.Suspense>
        {currentStep === 1 && (
          <Step1
            onCancel={closeModal}
            onNext={() => setCurrentStep(() => 2)}
            ip={ip}
            setIp={setIp}
            token={token}
            setToken={setToken}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onCancel={closeModal}
            onPrevious={() => {
              setCurrentStep(() => 1);
              setDestinationServer(undefined);
            }}
            onNext={() => setCurrentStep(() => 3)}
            ip={ip}
            token={token}
            destinationServer={destinationServer}
            setDestinationServer={setDestinationServer}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onCancel={closeModal}
            onPrevious={() => setCurrentStep(() => 2)}
            onNext={() => setCurrentStep(() => 4)}
            ip={ip}
            token={token}
            destinationServer={destinationServer}
            selectedDuration={duration}
            setSelectedDuration={setDuration}
          />
        )}
        {currentStep === 4 && (
          <Step4
            onCancel={closeModal}
            onPrevious={() => setCurrentStep(() => 3)}
            onNext={postIpMigrationOrder}
            ip={ip}
            token={token}
            destinationServer={destinationServer}
            duration={duration}
            error={ipMigrationOrderError}
            isNextButtonLoading={isIpMigrationOrderPending}
          />
        )}
        {currentStep === 5 && (
          <Step5
            onCancel={closeModal}
            onPrevious={() => setCurrentStep(() => 4)}
            orderData={ipMigrationOrderData?.data}
            onConfirm={() => {
              window.open(ipMigrationOrderData?.data?.url);
              addSuccess(
                t('step5SuccessMessage', {
                  orderId: ipMigrationOrderData?.data?.orderId,
                }),
              );
              closeModal();
            }}
          />
        )}
      </React.Suspense>
    </OdsModal>
  );
}
