import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_VARIANT,
  FormField,
  FormFieldError,
  FormFieldLabel,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';
import {
  useExportDnsZoneText,
  useImportDnsZoneText,
} from '@/zone/hooks/data/history.hooks';

const TTL_REGEX = /^\$TTL[ \t]+\d+\n.*/;

export interface ModifyTextualRecordModalProps {
  onCloseCallback?: () => void;
  onSuccessCallback?: () => void;
}

export default function ModifyTextualRecordModal({
  onCloseCallback,
  onSuccessCallback,
}: ModifyTextualRecordModalProps = {}) {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const zoneName = serviceName ?? '';
  const queryClient = useQueryClient();
  const { addSuccess, addError } = useNotifications();

  const {
    zoneText,
    isLoadingZoneText,
    zoneTextError,
  } = useExportDnsZoneText(zoneName);

  const { mutate: importZone, isPending } = useImportDnsZoneText();

  const [zoneDnsText, setZoneDnsText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Populate textarea when zone text is loaded, applying same cleanup as legacy code
  useEffect(() => {
    if (zoneText) {
      const cleaned = zoneText
        .replaceAll(/\\n/gi, '\n')
        .replaceAll(/\\t/gi, '  ')
        .replaceAll(/\\/gi, '');
      setZoneDnsText(cleaned);
    }
  }, [zoneText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setZoneDnsText(value);

    if (value && !TTL_REGEX.test(value)) {
      setValidationError(t('zone_page_modify_textual_error_regex'));
    } else {
      setValidationError(null);
    }
  };

  const handleConfirm = () => {
    if (!zoneDnsText || validationError) return;

    importZone(
      { zoneName, zoneFile: zoneDnsText },
      {
        onSuccess: () => {
          addSuccess(t('zone_page_modify_textual_success'), true);
          queryClient.invalidateQueries({
            queryKey: ['zone', 'export', zoneName],
          });
          queryClient.invalidateQueries({
            queryKey: ['zone-records', zoneName],
          });
          onSuccessCallback?.();
        },
        onError: (error: Error) => {
          addError(
            t('zone_page_modify_textual_error', {
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
    isLoadingZoneText ||
    !!zoneTextError ||
    !zoneDnsText ||
    !!validationError;

  return (
    <Modal open onOpenChange={(detail) => !detail.open && onCloseCallback?.()}>
      <ModalContent dismissible className="max-w-4xl">
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3}>
            {t('zone_page_modify_textual_title')}
          </Text>
        </ModalHeader>
        <ModalBody>
          {isLoadingZoneText && (
            <div className="flex justify-center py-6">
              <Spinner size={SPINNER_SIZE.lg} />
            </div>
          )}

          {!isLoadingZoneText && zoneTextError && (
            <Message color={MESSAGE_COLOR.critical} className="mb-4">
              <MessageBody>
                {t('zone_page_modify_textual_error', {
                  message: zoneTextError.message,
                })}
              </MessageBody>
            </Message>
          )}

          {!isLoadingZoneText && !zoneTextError && (
            <>
              <Text preset={TEXT_PRESET.paragraph} className="mb-4">
                {t('zone_page_modify_textual_description')}
              </Text>

              <Message color={MESSAGE_COLOR.warning} className="mb-2" dismissible={false}>
                <MessageBody>
                  {t('zone_page_modify_textual_confirm')}
                </MessageBody>
              </Message>

              <FormField className="mb-4">
                <FormFieldLabel>Zone DNS</FormFieldLabel>
                <Textarea
                  name="zoneDnsText"
                  value={zoneDnsText}
                  onChange={handleTextChange}
                  rows={15}
                  disabled={isPending}
                  invalid={!!validationError}
                  className="w-full font-mono text-sm"
                />
                {validationError && (
                  <FormFieldError>{validationError}</FormFieldError>
                )}
              </FormField>

              <Message color={MESSAGE_COLOR.information} className="mb-4" dismissible={false}>
                <MessageBody>
                  {t('zone_page_modify_textual_propagation_info')}
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
              {t('zone_page_modify_textual_cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitDisabled}
              loading={isPending}
            >
              {t('zone_page_modify_textual_submit')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
