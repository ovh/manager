import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  Button,
  BUTTON_VARIANT,
  FormField,
  FormFieldError,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
  Textarea,
  FileUpload,
  FileUploadList,
  FileUploadItem,
  FILE_UPLOAD_VARIANT,
  Link,
  MessageIcon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import {
  useExportDnsZoneText,
  useImportDnsZoneText,
} from '@/zone/hooks/data/history.hooks';
import { urls as zoneUrls } from '@/zone/routes/routes.constant';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

const TTL_REGEX = /^\$TTL[ \t]+\d+\n.*/;

export default function ModifyTextualRecordPage() {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const resolvedServiceName = serviceName ?? '';
  const queryClient = useQueryClient();
  const { addSuccess, addError, notifications } = useNotifications();
  const { data: ongoingOperationsLink } = useNavigationGetUrl([
    'web-ongoing-operations',
    '/dns',
    { search: resolvedServiceName },
  ]);
  const ongoingOperationsHref = ongoingOperationsLink as string;

  const { zoneText, isLoadingZoneText, zoneTextError } = useExportDnsZoneText(
    resolvedServiceName,
  );

  const { mutate: importZone, isPending } = useImportDnsZoneText();

  const [zoneDnsText, setZoneDnsText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  const handleFileUpload = async (detail: { files: File[] }) => {
    const { files } = detail;
    if (files.length === 0) return;

    const file = files[0];
    setUploadedFile(file);

    // Read file content
    const content = await file.text();
    setZoneDnsText(content);

    if (content && !TTL_REGEX.test(content)) {
      setValidationError(t('zone_page_modify_textual_error_regex'));
    } else {
      setValidationError(null);
    }
  };

  const handleConfirm = () => {
    if (!zoneDnsText || validationError) return;

    importZone(
      { zoneName: resolvedServiceName, zoneFile: zoneDnsText },
      {
        onSuccess: () => {
          addSuccess(
            <span style={{ display: 'inline' }}>
              <Trans
                t={t}
                i18nKey="zone_page_modify_textual_success"
                components={{
                  Link: <Link href={ongoingOperationsHref} />,
                }}
              />
            </span>,
            true,
          );
          queryClient.invalidateQueries({
            queryKey: ['zone', 'export', resolvedServiceName],
          });
          queryClient.invalidateQueries({
            queryKey: ['zone-records', resolvedServiceName],
          });
          navigate(backUrl, { replace: true });
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

  const handleCancel = () => {
    navigate(backUrl, { replace: true });
  };

  const isSubmitDisabled =
    isPending ||
    isLoadingZoneText ||
    !!zoneTextError ||
    !zoneDnsText ||
    !!validationError;

  const backUrl = zoneUrls.zoneRoot.replace(
    ':serviceName',
    resolvedServiceName,
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={serviceName ?? ''}
          appName="domain"
          hideRootLabel
        />
      }
      header={{ title: serviceName }}
      backLinkLabel={t('zone_page_modify_textual_back')}
      onClickReturn={handleCancel}
      message={notifications.length > 0 ? <Notifications /> : null}
    >
      <div className="mb-4">
        <Text preset={TEXT_PRESET.heading3} className="mb-4">
          {t('zone_page_modify_textual_title')}
        </Text>

        {isLoadingZoneText && (
          <div className="flex justify-center py-6">
            <Spinner size={SPINNER_SIZE.lg} />
          </div>
        )}

        {!isLoadingZoneText && zoneTextError && (
          <Message color={MESSAGE_COLOR.critical} className="mb-4">
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
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

            <Message
              color={MESSAGE_COLOR.information}
              className="mb-4"
              dismissible={false}
            >
              <MessageIcon name={ICON_NAME.circleInfo} />
              <MessageBody>
                {t('zone_page_modify_textual_propagation_info')}
              </MessageBody>
            </Message>

            <div className="mb-4">
              <FileUpload
                accept=".txt,.zone"
                maxFile={1}
                dropzoneLabel={t('zone_page_modify_textual_dropzone_label')}
                acceptedFileLabel={t('zone_page_modify_textual_accepted_files')}
                onFileAccept={handleFileUpload}
                disabled={isPending}
                variant={FILE_UPLOAD_VARIANT.compact}
              >
                {uploadedFile && (
                  <FileUploadList>
                    <FileUploadItem file={uploadedFile} />
                  </FileUploadList>
                )}
              </FileUpload>
            </div>

            <FormField className="mb-4">
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
          </>
        )}

        <div className="flex gap-4 justify-start mt-6">
          <Button
            variant={BUTTON_VARIANT.ghost}
            onClick={handleCancel}
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
      </div>
    </BaseLayout>
  );
}
