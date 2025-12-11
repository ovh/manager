import { useCallback, useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';
import type { SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

import { AGREEMENT, CONFIRM } from '@/Tracking.constants';
import { postAcceptAgreement, postCreateAttestation } from '@/data/api/mca/api';
import { CreateAttestationBodyParamsType } from '@/data/api/mca/type';
import { getParentTenant } from '@/data/api/parent-tenant/api';
import { getOfficeParentTenantQueryKey } from '@/data/api/parent-tenant/key';

import McaStep1 from './McaStep1.component';
import McaStep2 from './McaStep2.component';

export const McaPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [microsoftUrl, setMicrosoftUrl] = useState('');
  const { addError, addSuccess } = useNotifications();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['dashboard/microsoft-customer-agreement', NAMESPACES.ERROR]);
  const context = useContext(ShellContext);
  const { country, email, firstname, language, name, organisation, phone } =
    context.environment.getUser();
  const { serviceName } = useParams();

  const handleSaveClick: SubmitHandler<CreateAttestationBodyParamsType> = ({
    companyName,
    country,
    emailAddress,
    language,
    phoneNumber,
    signatoryFirstName,
    signatoryLastName,
  }) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [AGREEMENT, CONFIRM],
    });
    submitMca({
      companyName,
      country,
      emailAddress,
      language,
      phoneNumber,
      signatoryFirstName,
      signatoryLastName,
    });
  };

  const onSuccess = useCallback(() => {
    addSuccess(<Text preset={TEXT_PRESET.paragraph}>{t('signatory_success_message')}</Text>, true);
    navigate(`/license/${serviceName}`);
  }, [t, addSuccess, navigate, serviceName]);

  const { mutate: submitMca, isPending: isSubmitting } = useMutation({
    mutationFn: (params: CreateAttestationBodyParamsType) =>
      postCreateAttestation(serviceName, params),
    onSuccess: ({ attestationLink }) => {
      window.open(attestationLink, '_blank');
      setMicrosoftUrl(attestationLink);
      setStep(2);
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
  });

  const { mutate: confirmMca, isPending: isConfirmPending } = useMutation({
    mutationFn: () => postAcceptAgreement(serviceName),
    onSuccess: onSuccess,
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
  });

  const { data } = useQuery({
    queryKey: [getOfficeParentTenantQueryKey(serviceName), serviceName],
    queryFn: () => getParentTenant(serviceName),
    refetchInterval: 5000,
    enabled: !!serviceName && step === 2,
  });

  useEffect(() => {
    if (data?.mcaAgreed) {
      onSuccess();
    }
  }, [data, onSuccess]);

  return (
    <>
      {step === 1 && (
        <McaStep1
          country={country}
          email={email}
          firstname={firstname}
          language={language}
          name={name}
          organisation={organisation}
          phone={phone}
          handleSaveClick={handleSaveClick}
          isSubmitting={isSubmitting}
        ></McaStep1>
      )}
      {step === 2 && (
        <McaStep2
          microsoftUrl={microsoftUrl}
          onClick={confirmMca}
          isLoading={isConfirmPending}
        ></McaStep2>
      )}
    </>
  );
};

export default McaPage;
