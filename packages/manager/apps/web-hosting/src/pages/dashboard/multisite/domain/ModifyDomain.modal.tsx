import { useCallback, useEffect, useState } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { putAttachedDomain } from '@/data/api/webHosting';
import { useGetAttachedDomainDetails } from '@/data/hooks/webHosting/webHostingAttachedDomain/useWebHostingAttachedDomain';
import {
  useGetDomainZone,
  useGetHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { PostWebHostingAttachedDomainPayload } from '@/data/types/product/webHosting';
import { GitStatus, ServiceStatus } from '@/data/types/status';

import Step1 from './ModifyDomainSteps/step1';
import Step2 from './ModifyDomainSteps/step2';
import { FormValues } from './ModifyDomainSteps/types';

interface ModifyDomainState {
  serviceName?: string;
  domain?: string;
  path?: string;
  gitStatus?: GitStatus;
  firewallStatus?: ServiceStatus;
  cdnStatus?: ServiceStatus;
}

export default function ModifyModalDomain() {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'common',
    'multisite',
    NAMESPACES.ACTIONS,
    NAMESPACES.COUNTRIES,
    NAMESPACES.ERROR,
  ]);
  const [step, setStep] = useState(1);
  const { state } = useLocation() as Location<ModifyDomainState>;
  const { data: hosting } = useGetHostingService(state.serviceName);
  const { data: zones = [] } = useGetDomainZone();
  const { data: domainDetails } = useGetAttachedDomainDetails(state.serviceName, state.domain);
  const isGitDisabled = state.gitStatus === GitStatus.DISABLED;
  const { control, watch, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      domain: state.domain ?? '',
      path: state.path ?? '',
      cdn: state.cdnStatus ?? ServiceStatus.INACTIVE,
      firewall: state.firewallStatus ?? ServiceStatus.INACTIVE,
      countriesIpEnabled:
        state.cdnStatus !== ServiceStatus.ACTIVE ? !!domainDetails?.ipLocation : false,
      enableOwnLog: false,
      ownLog: '',
    },
  });

  useEffect(() => {
    if (!domainDetails) return;
    const next = {
      domain: state.domain ?? '',
      path: state.path ?? '',
      cdn: state.cdnStatus ?? ServiceStatus.INACTIVE,
      firewall: state.firewallStatus ?? ServiceStatus.INACTIVE,
      countriesIpEnabled:
        state.cdnStatus !== ServiceStatus.ACTIVE ? !!domainDetails?.ipLocation : false,
      enableOwnLog: false,
      ownLog: '',
    };

    reset(next);
  }, [domainDetails, reset]);

  const { addError, addSuccess } = useNotifications();
  const onClose = () => navigate(-1);

  const { mutate: onUpdateDomain } = useMutation<
    void,
    ApiError,
    PostWebHostingAttachedDomainPayload
  >({
    mutationFn: async (payload) => {
      try {
        await putAttachedDomain(state.serviceName, state.domain, payload);
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite:multisite_modal_domain_configuration_modify_success')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`multisite:multisite_modal_domain_configuration_modify_failure`, {
            message: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });

  const onSubmitForm = useCallback(
    (values: FormValues) => {
      const payload: PostWebHostingAttachedDomainPayload = {
        bypassDNSConfiguration: false,
        cdn: values.cdn.toLowerCase() as Lowercase<ServiceStatus>,
        domain: values.domain,
        firewall: values.firewall.toLowerCase() as Lowercase<ServiceStatus>,
        ...(values.ipLocation !== undefined && { ipLocation: values.ipLocation }),
        ownLog: values.ownLog,
        path: values.path,
        ssl: hosting?.hasHostedSsl ?? false,
      };
      onUpdateDomain(payload);
    },
    [hosting?.hasHostedSsl, onUpdateDomain],
  );

  const onPrimaryButtonClick = useCallback(() => {
    if (step === 1) {
      setStep(2);
      return;
    }
    handleSubmit(onSubmitForm)().catch(console.error);
  }, [step, handleSubmit, onSubmitForm]);

  return (
    <Modal
      heading={t('modify_domain')}
      onOpenChange={onClose}
      open={true}
      primaryButton={{
        label: step === 1 ? t(`${NAMESPACES.ACTIONS}:next`) : t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onPrimaryButtonClick,
        disabled: !isGitDisabled,
      }}
      secondaryButton={{
        label: step === 1 ? t(`${NAMESPACES.ACTIONS}:cancel`) : t(`${NAMESPACES.ACTIONS}:previous`),
        onClick: () => {
          if (step === 2) {
            setStep(1);
          } else {
            onClose();
          }
        },
      }}
    >
      {step === 1 && (
        <Step1
          control={control}
          isGitDisabled={isGitDisabled}
          hosting={hosting}
          domainDetails={domainDetails}
          zones={zones}
          watch={watch}
        />
      )}
      {step === 2 && <Step2 watch={watch} hosting={hosting} />}
    </Modal>
  );
}
