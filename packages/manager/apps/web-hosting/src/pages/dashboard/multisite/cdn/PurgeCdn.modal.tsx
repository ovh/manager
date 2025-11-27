import { useCallback, useEffect, useMemo } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { flushCDNDomainCache, flushCdn } from '@/data/api/cdn';
import { useGetCDNProperties } from '@/data/hooks/cdn/useCdn';
import { CDN_TYPE, CDN_VERSION, PURGE_TYPE_ENUM } from '@/data/types/product/cdn';

interface PurgeCdnModalState {
  serviceName: string;
  domain: string;
  path?: string;
}

interface CdnFlushOption {
  disabled: boolean;
  patternType: string;
  hint: string | null;
  pattern: string;
}

interface FormValues {
  selectedOption: CdnFlushOption;
}

export default function PurgeCdnModal() {
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);
  const { state } = useLocation() as Location<PurgeCdnModalState>;
  const { data: cdnProperties } = useGetCDNProperties(state.serviceName);

  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      selectedOption: {
        disabled: false,
        patternType: PURGE_TYPE_ENUM.ALL,
        hint: null,
        pattern: '',
      },
    },
  });

  const selectedOption = watch('selectedOption');

  const options = useMemo(() => {
    if (!cdnProperties) return [];
    const isAdvancedCdnType = cdnProperties.type === CDN_TYPE.ADVANCED;
    return [
      {
        disabled: false,
        patternType: PURGE_TYPE_ENUM.ALL,
        hint: null,
        pattern: '',
      },
      {
        disabled: !isAdvancedCdnType,
        patternType: PURGE_TYPE_ENUM.FOLDER,
        hint: '/folder/',
        pattern: '',
      },
      {
        disabled: !isAdvancedCdnType,
        patternType: PURGE_TYPE_ENUM.URI,
        hint: '/folder/file.jpg',
        pattern: '',
      },
      {
        disabled: !isAdvancedCdnType,
        patternType: PURGE_TYPE_ENUM.EXTENSION,
        hint: 'jpg',
        pattern: '',
      },
      {
        disabled: !isAdvancedCdnType,
        patternType: PURGE_TYPE_ENUM.REGEX,
        hint: '.*/file.jpg$',
        pattern: '',
      },
    ];
  }, [cdnProperties]);

  useEffect(() => {
    if (options.length > 0) {
      setValue('selectedOption', options[0]);
    }
  }, [options, setValue]);

  const { mutate: flushCdnMutation, isPending: isFlushing } = useMutation<
    void,
    ApiError,
    { pattern?: string; patternType?: string }
  >({
    mutationFn: async ({ pattern, patternType }) => {
      const isV1Cdn = cdnProperties?.version === CDN_VERSION.CDN_V1;
      if (isV1Cdn) {
        await flushCdn(state.serviceName);
      } else {
        let queryParams = '';
        if (patternType && patternType !== PURGE_TYPE_ENUM.ALL && pattern) {
          const params = new URLSearchParams();
          if (pattern) params.append('pattern', pattern);
          if (patternType) params.append('patternType', patternType);
          queryParams = params.toString();
        }
        await flushCDNDomainCache(state.serviceName, state.domain, queryParams);
      }
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('multisite:multisite_cdn_modal_purge_success')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`multisite:multisite_cdn_modal_purge_success`, {
            message: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      navigate(-1);
    },
  });

  const onClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onPrimaryButtonClick = useCallback(() => {
    const { pattern, patternType } = selectedOption;
    handleSubmit(() => {
      flushCdnMutation({
        pattern: patternType !== PURGE_TYPE_ENUM.ALL ? pattern : undefined,
        patternType: patternType !== PURGE_TYPE_ENUM.ALL ? patternType : undefined,
      });
    })().catch(console.error);
  }, [selectedOption, flushCdnMutation, handleSubmit]);

  const handleOptionChange = useCallback(
    (option: CdnFlushOption) => {
      setValue('selectedOption', option);
    },
    [setValue],
  );

  return (
    <Modal
      heading={t('multisite:multisite_cdn_modal_purge_title')}
      onDismiss={onClose}
      isOpen
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isPrimaryButtonDisabled={isFlushing}
    >
      <OdsText>{t('multisite:multisite_cdn_modal_purge_description')}</OdsText>
      <OdsText className="mt-4">
        <Trans i18nKey="multisite:multisite_cdn_modal_purge_subdescription" />
      </OdsText>
      <div className="modal-body p-0 pb-3">
        <OdsText className="m-0 mb-4" data-ng-bind={state.domain}>
          {state.domain}
        </OdsText>
        <div className="mb-4">
          {options.map((option) => (
            <Controller
              name="selectedOption"
              control={control}
              key={option.patternType}
              render={({ field }) => (
                <div className="flex leading-none gap-4 mt-4">
                  <OdsRadio
                    id={`option-${option.patternType}`}
                    name={`option-${option.patternType}`}
                    value={option.patternType}
                    isChecked={field.value.patternType === option.patternType}
                    onChange={() => handleOptionChange(option)}
                    isDisabled={option.disabled}
                    className="mb-2"
                    input-id={`option-${option.patternType}`}
                  />
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t(
                      `multisite:multisite_cdn_modal_purge_option_${option.patternType.toLowerCase()}`,
                    )}
                  </OdsText>
                </div>
              )}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
