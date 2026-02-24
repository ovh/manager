import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_VARIANT,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
  MESSAGE_COLOR,
  Message,
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  TEXT_PRESET,
  Text,
  ModalHeader,
  MessageIcon,
  ICON_NAME,
  MessageBody,
} from '@ovhcloud/ods-react';
import {
  useGetZoneSoa,
  useUpdateZoneSoa,
} from '@/zone/hooks/data/history.hooks';

const TTL_MIN = 60;
const TTL_MAX = 2147483647;

export interface ModifyTtlModalProps {
  onCloseCallback?: () => void;
  onSuccessCallback?: () => void;
}

export default function ModifyTtlModal({
  onCloseCallback,
  onSuccessCallback,
}: ModifyTtlModalProps = {}) {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const zoneName = serviceName ?? '';
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  const { zoneSoa, isLoadingZoneSoa, zoneSoaError } = useGetZoneSoa(zoneName);
  const { mutate: updateSoa, isPending } = useUpdateZoneSoa();

  const [ttlValue, setTtlValue] = useState<number | ''>(
    zoneSoa?.ttl ?? '',
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync local value when SOA data loads
  useEffect(() => {
    if (zoneSoa?.ttl !== undefined) {
      setTtlValue(zoneSoa.ttl);
    }
  }, [zoneSoa?.ttl]);

  const handleTtlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setTtlValue('');
      setValidationError(null);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    setTtlValue(parsed);
    if (Number.isNaN(parsed) || parsed < TTL_MIN || parsed > TTL_MAX) {
      setValidationError(
        t('zone_page_modify_ttl_value_conditions', {
          min: TTL_MIN,
          max: TTL_MAX,
        }),
      );
    } else {
      setValidationError(null);
    }
  };

  const handleConfirm = () => {
    if (!zoneSoa || ttlValue === '' || validationError) return;
    updateSoa(
      { zoneName, soa: { ...zoneSoa, ttl: ttlValue } },
      {
        onSuccess: () => {
          addSuccess(t('zone_page_modify_ttl_success'), true);
          queryClient.invalidateQueries({
            queryKey: ['zone', 'soa', zoneName],
          });
          onSuccessCallback?.();
        },
        onError: (error: Error) => {
          addError(
            t('zone_page_modify_ttl_error', {
              message: error.message,
            }),
            true,
          );
        },
      },
    );
  };

  const isSubmitDisabled =
    isPending ||
    isLoadingZoneSoa ||
    !!zoneSoaError ||
    ttlValue === '' ||
    !!validationError;

  return (
    <Modal open onOpenChange={(detail) => !detail.open && onCloseCallback?.()}>
      <ModalContent dismissible>
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3}>
            {t('zone_page_modify_ttl_title')}
          </Text>
        </ModalHeader>
        <ModalBody>

          {isLoadingZoneSoa && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}

          {!isLoadingZoneSoa && zoneSoaError && (
            <Message color={MESSAGE_COLOR.critical} className="mb-4">
              <MessageIcon name={ICON_NAME.hexagonExclamation} />
              <MessageBody>
                {t('zone_page_modify_ttl_error', {
                  message: zoneSoaError.message,
                })}
              </MessageBody>
            </Message>
          )}

          {!isLoadingZoneSoa && !zoneSoaError && (
            <>
              <Text preset={TEXT_PRESET.paragraph} className="mb-2">
                {t('zone_page_modify_ttl_info')}
              </Text>
              <Text preset={TEXT_PRESET.paragraph} className="mb-4">
                <Trans
                  i18nKey="zone_page_modify_ttl_heading"
                  ns="zone"
                  values={{ zone: zoneName }}
                  components={{ bold: <span className="font-bold" /> }}
                />
              </Text>

              <FormField className="mb-4">
                <FormFieldLabel>
                  {t('zone_page_modify_ttl_label')}
                </FormFieldLabel>
                <Input
                  type={INPUT_TYPE.number}
                  name="ttl"
                  value={ttlValue === '' ? '' : String(ttlValue)}
                  onChange={handleTtlChange}
                  min={String(TTL_MIN)}
                  max={String(TTL_MAX)}
                  step={1}
                  invalid={!!validationError}
                  disabled={isPending}
                />
                {validationError && (
                  <FormFieldError>{validationError}</FormFieldError>
                )}
                <div className="mt-1 text-[--ods-color-neutral-500] flex flex-col">
                  <Text preset={TEXT_PRESET.caption}>{t('zone_page_modify_ttl_help_1')}</Text>
                  <Text preset={TEXT_PRESET.caption}>{t('zone_page_modify_ttl_help_2')}</Text>
                </div>
              </FormField>

              <Message color={MESSAGE_COLOR.information} className="mb-4" dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <MessageBody>
                  {t('zone_page_modify_ttl_propagation_info')}
                </MessageBody>
              </Message>
            </>
          )}

          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={onCloseCallback}
              disabled={isPending}
            >
              {t('zone_page_modify_ttl_cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitDisabled}
              loading={isPending}
            >
              {t('zone_page_modify_ttl_confirm')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
