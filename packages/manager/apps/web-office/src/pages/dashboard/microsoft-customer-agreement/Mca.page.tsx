import { useContext, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
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
import { postCreateAttestation } from '@/data/api/mca/api';
import { CreateAttestationBodyParamsType } from '@/data/api/mca/type';

import McaStep1 from './McaStep1.component';

export const McaPage = () => {
  const [step, setStep] = useState(1);
  const { addError } = useNotifications();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation([NAMESPACES.ERROR]);
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

  const { mutate: submitMca, isPending: isSubmitting } = useMutation({
    mutationFn: (params: CreateAttestationBodyParamsType) =>
      postCreateAttestation(serviceName, params),
    onSuccess: ({ attestationLink }) => {
      window.open(attestationLink, '_blank');
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
      {step === 2 && <div></div> /* @todo PRDCOL-294 */}
    </>
  );
};

export default McaPage;
