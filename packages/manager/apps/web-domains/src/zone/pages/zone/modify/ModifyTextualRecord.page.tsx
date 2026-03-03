import { useEffect, useRef, useState } from 'react';
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
  ICON_NAME,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
  FileUpload,
  FileUploadList,
  FileUploadItem,
  FILE_UPLOAD_VARIANT,
  Link,
  MessageIcon,
} from '@ovhcloud/ods-react';
import {
  useExportDnsZoneText,
  useImportDnsZoneText,
} from '@/zone/hooks/data/history.hooks';
import { urls as zoneUrls } from '@/zone/routes/routes.constant';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import LinkToOngoingOperations from '@/domain/components/LinkToOngoingOperations/LinkToOngoingOperations';

const TTL_REGEX = /^\$TTL[ \t]+\d+\n.*/;

export default function ModifyTextualRecordPage() {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const resolvedServiceName = serviceName ?? '';
  const queryClient = useQueryClient();
  const {
    addSuccess,
    addError,
    clearNotifications,
    notifications,
  } = useNotifications();
  const { zoneText, isLoadingZoneText, zoneTextError } = useExportDnsZoneText(
    resolvedServiceName,
  );

  const { mutate: importZone, isPending } = useImportDnsZoneText();

  const [zoneDnsText, setZoneDnsText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const preImportTextRef = useRef<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = (zoneDnsText || '').split('\n').length;

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
    validateText(value);
  };

  const validateText = (text: string) => {
    if (text && !TTL_REGEX.test(text)) {
      setValidationError(t('zone_page_modify_textual_error_regex'));
    } else {
      setValidationError(null);
    }
  };

  const handleFileAccept = async ({
    files: acceptedFiles,
  }: {
    files: File[];
  }) => {
    // Deletion: restore pre-import text
    if (acceptedFiles.length < files.length) {
      setFiles(acceptedFiles);
      const restoredText = preImportTextRef.current;
      setZoneDnsText(restoredText);
      validateText(restoredText);
      return;
    }

    // Addition: save pre-import text and read file content
    if (files.length === 0) {
      preImportTextRef.current = zoneDnsText;
    }
    setFiles(acceptedFiles);

    const content = await acceptedFiles[0].text();
    setZoneDnsText(content);
    validateText(content);
  };

  const handleConfirm = () => {
    if (!zoneDnsText || validationError) return;

    importZone(
      { zoneName: resolvedServiceName, zoneFile: zoneDnsText },
      {
        onSuccess: () => {
          clearNotifications();
          addSuccess(
            <span style={{ display: 'inline' }}>
              <Trans
                t={t}
                i18nKey="zone_page_modify_textual_success"
                components={{
                  Link: <LinkToOngoingOperations target="dns" />,
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
          clearNotifications();
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
      message={notifications.length > 0 ? <Notifications /> : undefined}
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
                onFileAccept={handleFileAccept}
                disabled={isPending}
                variant={FILE_UPLOAD_VARIANT.compact}
              >
                <FileUploadList>
                  {files.map((file, idx) => (
                    <FileUploadItem file={file} key={idx} />
                  ))}
                </FileUploadList>
              </FileUpload>
            </div>

            <FormField className="mb-4">
              <div
                className="flex rounded overflow-hidden"
                style={{
                  height: '500px',
                  border: validationError
                    ? '2px solid var(--ods-color-critical-500, #dc2626)'
                    : '1px solid var(--ods-color-neutral-200, #e5e7eb)',
                }}
              >
                <div
                  ref={gutterRef}
                  className="select-none text-right shrink-0 overflow-hidden"
                  style={{
                    padding: '8px 12px',
                    color: '#9ca3af',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '21px',
                    backgroundColor: '#f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                  }}
                  aria-hidden="true"
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  name="zoneDnsText"
                  value={zoneDnsText}
                  onChange={handleTextChange}
                  onScroll={() => {
                    if (gutterRef.current && textareaRef.current) {
                      gutterRef.current.scrollTop =
                        textareaRef.current.scrollTop;
                    }
                  }}
                  disabled={isPending}
                  className="flex-1 resize-none outline-none bg-white overflow-auto"
                  style={{
                    padding: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '21px',
                    border: 'none',
                  }}
                  spellCheck={false}
                />
              </div>
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
