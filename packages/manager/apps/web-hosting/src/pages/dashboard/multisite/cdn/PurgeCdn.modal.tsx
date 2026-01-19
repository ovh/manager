import { useCallback, useEffect, useMemo } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
  const { control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      selectedOption: {
        disabled: false,
        patternType: PURGE_TYPE_ENUM.ALL,
        hint: null,
        pattern: '',
      },
    },
  });

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
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite:multisite_cdn_modal_purge_success')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite:multisite_cdn_modal_purge_error', {
            message: error?.response?.data?.message,
          })}
        </Text>,
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
    const { pattern, patternType } = watch('selectedOption');
    flushCdnMutation({
      pattern: patternType !== PURGE_TYPE_ENUM.ALL ? pattern : undefined,
      patternType: patternType !== PURGE_TYPE_ENUM.ALL ? patternType : undefined,
    });
  }, [watch, flushCdnMutation]);

  return (
    <Modal
      heading={t('multisite:multisite_cdn_modal_purge_title')}
      onOpenChange={() => onClose()}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onPrimaryButtonClick,
        disabled: isFlushing,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      <Text>{t('multisite:multisite_cdn_modal_purge_description')}</Text>
      <Text className="mt-4">
        <Trans i18nKey="multisite:multisite_cdn_modal_purge_subdescription" />
      </Text>
      <div className="modal-body p-0 pb-3">
        <Text className="m-0 mb-4" data-ng-bind={state.domain}>
          {state.domain}
        </Text>
        <Controller
          name="selectedOption"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value.patternType}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement).value;

                const selectedOption = options.find((opt) => opt.patternType === value);

                if (selectedOption) {
                  field.onChange(selectedOption);
                }
              }}
            >
              {options.map((option) => (
                <div key={option.patternType} className="mt-4 flex items-center gap-4 leading-none">
                  <Radio
                    value={option.patternType}
                    disabled={option.disabled}
                    id={`option-${option.patternType}`}
                  >
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t(
                          `multisite:multisite_cdn_modal_purge_option_${option.patternType.toLowerCase()}`,
                        )}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>
    </Modal>
  );
}
