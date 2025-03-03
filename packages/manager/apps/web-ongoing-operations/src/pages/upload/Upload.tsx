import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsDivider,
  OdsFileUpload,
  OdsMessage,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  OdsFile,
  OdsFileChangeEventDetail,
  OdsFileRejectedEventDetail,
  OdsFileUploadCustomEvent,
} from '@ovhcloud/ods-components';
import { useMutation } from '@tanstack/react-query';
import { updateTask } from '@/data/api/web-ongoing-operations';
import SubHeader from '@/components/SubHeader/SubHeader';
import { saveFile } from '@/data/api/document';
import { urls } from '@/routes/routes.constant';
import Loading from '@/components/Loading/Loading';
import { useDomain, useDomainArgument } from '@/hooks/data/data';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { OperationName } from '@/enum/operationName.enum';
import { ParentEnum } from '@/hooks/useOngoingOperationDatagridColumns';

export default function Upload() {
  const { t } = useTranslation('dashboard');
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [operationName, setOperationName] = useState<OperationName>(null);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);
  const [errorUpload, setErrorUpload] = useState<string>('');
  const maxFile = 1;
  const paramId = Number(id);

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);

  const {
    data: domainArgument,
    isLoading: argumentLoading,
  } = useDomainArgument(paramId, type);

  const { mutate: executeActionOnOperation } = useMutation({
    mutationFn: (operationID: number) =>
      updateOperationStatus(ParentEnum.Domain, operationID, operationName),
    onSuccess: () => navigate(urls.domain),
    onError: () => {
      setStatus({
        label: ODS_MESSAGE_COLOR.warning,
        message: t('domain_operations_upload_error'),
      });
    },
  });

  const saveFileAndUpdateOperation = async (
    operationID: number,
    file: OdsFile,
  ) => {
    const documentId = await saveFile(file);
    const body = { value: documentId };
    await updateTask(operationID, type, body);
  };

  const onValidate = (operationID: number) => {
    const promiseArray: Promise<void>[] = [];
    setStatus({
      label: ODS_MESSAGE_COLOR.information,
      message: t('domain_operations_upload_doing'),
    });
    uploadedFiles.forEach((file) => {
      promiseArray.push(saveFileAndUpdateOperation(operationID, file));
    });
    Promise.all(promiseArray)
      .then(async () => {
        setStatus({
          label: ODS_MESSAGE_COLOR.success,
          message: t('domain_operations_upload_success'),
        });
        executeActionOnOperation(operationID);
      })
      .catch(() => {
        setStatus({
          label: ODS_MESSAGE_COLOR.warning,
          message: t('domain_operations_upload_error'),
        });
      });
  };

  if (domainLoading || argumentLoading) {
    return (
      <div data-testid="listing-page-spinner">
        <Loading />
      </div>
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
    >
      {status.label && (
        <OdsMessage
          color={status.label as 'information' | 'success' | 'warning'}
          onOdsRemove={() => setStatus(defaultStatus)}
          className="mb-4 w-full"
        >
          {status.message}
        </OdsMessage>
      )}

      <SubHeader domain={domain} />
      <section>
        <div className="flex flex-col gap-y-1 mb-6">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_comment')}
            <strong> {domain.comment}</strong>
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_data')}
            <strong>
              "{t(`domain_operations_nicOperation_${domain.function}`)}"
            </strong>
          </OdsText>
        </div>

        <div>
          <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.span}>
            <strong>{domainArgument.description}</strong>
          </OdsText>
          <OdsFileUpload
            onOdsChange={(
              e: OdsFileUploadCustomEvent<OdsFileChangeEventDetail>,
            ) => {
              setUploadedFiles(e.detail.files);
              setOperationName(OperationName.CanRelaunch);
            }}
            onOdsCancel={() => {
              setUploadedFiles([]);
              setOperationName(null);
              setErrorUpload('');
            }}
            onOdsRejected={(
              e: OdsFileUploadCustomEvent<OdsFileRejectedEventDetail>,
            ) => setErrorUpload(e.detail.reason)}
            error={
              errorUpload && t(`domain_operations_upload_error_${errorUpload}`)
            }
            maxFile={maxFile}
            maxSize={domainArgument.maximumSize}
            maxSizeLabel={t('domain_operations_upload_max_size_label')}
            accept={`.${domainArgument.acceptedFormats.join(', ')}`}
            acceptedFileLabel={`${t(
              'domain_operations_upload_accepted_file_types',
            )} ${domainArgument.acceptedFormats.map(
              (acceptedFormat: string) => {
                return `${acceptedFormat} `;
              },
            )}`}
            files={uploadedFiles}
            className="w-1/4"
            data-testid="upload"
          />
        </div>

        <OdsDivider
          color={ODS_DIVIDER_COLOR.light}
          spacing={ODS_DIVIDER_SPACING._48}
        />

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-1">
            <OdsRadio
              inputId="radio-relaunch"
              name="radio-format"
              onOdsChange={() => {
                setOperationName(OperationName.CanRelaunch);
              }}
              isDisabled={operationName !== OperationName.CanRelaunch}
            ></OdsRadio>
            <label
              htmlFor="radio-relaunch"
              className="form-field__radio__field__label"
            >
              {t('domain_operations_relaunch_title')}
            </label>
          </div>

          <div className="flex items-center gap-x-1">
            <OdsRadio
              inputId="radio-accelerate"
              name="radio-format"
              isDisabled={!domain.canAccelerate}
              onOdsChange={() => {
                setOperationName(OperationName.CanAccelerate);
              }}
            ></OdsRadio>
            <label
              htmlFor="radio-accelerate"
              className="form-field__radio__field__label"
            >
              {t('domain_operations_accelerate_title')}
            </label>
          </div>

          <div className="flex items-center gap-x-1">
            <OdsRadio
              inputId="radio-cancel"
              name="radio-format"
              isDisabled={!domain.canCancel}
              onOdsChange={() => {
                setOperationName(OperationName.CanCancel);
              }}
            ></OdsRadio>
            <label
              htmlFor="radio-cancel"
              className="form-field__radio__field__label"
            >
              {t('domain_operations_cancel_title')}
            </label>
          </div>

          {operationName === OperationName.CanAccelerate && (
            <OdsMessage color="warning" isDismissible={false}>
              {t('domain_operations_accelerate_warning')}
            </OdsMessage>
          )}

          <div className="flex justify-start gap-x-2">
            <OdsButton
              label={t('wizard_cancel')}
              slot="actions"
              onClick={() => {
                setOperationName(null);
                navigate(urls.root);
              }}
              variant={ODS_BUTTON_VARIANT.outline}
            />
            <OdsButton
              label={t('wizard_confirm')}
              slot="actions"
              onClick={() => onValidate(domain.id as number)}
              isDisabled={operationName == null && uploadedFiles.length === 0}
            />
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
