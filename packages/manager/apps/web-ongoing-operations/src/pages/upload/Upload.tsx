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
import { useQuery } from '@tanstack/react-query';
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
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
  updateTask,
} from '@/data/api/web-ongoing-operations';
import SubHeader from '@/components/SubHeader/SubHeader';
import { TArgument, TOngoingOperations } from '@/types';
import { saveFile } from '@/data/api/document';
import { useDoOperation } from '@/hooks/actions/useActions';
import { urls } from '@/routes/routes.constant';
import Loading from '@/components/Loading/Loading';

export default function upload() {
  const { t } = useTranslation('dashboard');
  const { id, type } = useParams<{ id: string; type: string }>();
  const paramId = Number(id);
  const navigate = useNavigate();
  const [canRelaunch, setCanRelaunch] = useState<boolean>(false);
  const [canAccelerate, setCanAccelerate] = useState<boolean>(false);
  const [canCancel, setCanCancel] = useState(false);
  const [status, setStatus] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);
  const [errorUpload, setErrorUpload] = useState<string>('');
  const maxFile = 1;

  const fetchDomainData = async () => {
    const response = await getmeTaskDomainId(paramId);
    return response.data as TOngoingOperations;
  };

  const fetchDomainArgument = async (
    domainId: string,
    argumentType: string,
  ) => {
    const response = await getmeTaskDomainArgument(domainId, argumentType);
    return response.data as TArgument;
  };

  const { data: domain, isLoading: domainLoading } = useQuery({
    queryKey: ['domain'],
    queryFn: () => fetchDomainData(),
  });

  const { data: domainArgument, isLoading: argumentLoading } = useQuery<
    TArgument
  >({
    queryKey: ['argument'],
    queryFn: () => fetchDomainArgument(id, type),
  });

  const changeStatus = ({
    label,
    message,
  }: {
    label?: string;
    message?: string;
  }) => {
    setStatus(label);
    setStatusMessage(message);
  };

  const operationType = () => {
    switch (true) {
      case canRelaunch:
        return 'relaunch';
      case canAccelerate:
        return 'accelerate';
      case canCancel:
        return 'cancel';
      default:
        return null;
    }
  };

  const executeActionOnOperation = async (operationID: number) => {
    await useDoOperation('domain', operationID, operationType());
    navigate(urls.domain);
  };

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
    changeStatus({
      label: 'success',
      message: t('domain_operations_upload_doing'),
    });
    for (let i = 0; i < uploadedFiles.length; i += 1) {
      promiseArray.push(
        saveFileAndUpdateOperation(operationID, uploadedFiles[i]),
      );
    }
    Promise.all(promiseArray)
      .then(async () => {
        changeStatus({
          label: 'success',
          message: t('domain_operations_upload_success'),
        });
        executeActionOnOperation(operationID);
      })
      .catch(() => {
        changeStatus({
          label: 'error',
          message: t('domain_operations_upload_error'),
        });
      });
  };

  if (domainLoading && argumentLoading) {
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
      {status === 'success' && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.success}
          onOdsRemove={() => changeStatus({})}
          className="mb-4 w-full"
        >
          {statusMessage}
        </OdsMessage>
      )}

      {status === 'error' && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.warning}
          onOdsRemove={() => changeStatus({})}
          className="mb-4 w-full"
        >
          {statusMessage}
        </OdsMessage>
      )}

      <SubHeader domain={domain} />
      <section>
        <div className="flex flex-col gap-y-1 mb-6">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_comment')}
            <strong> {domain?.comment}</strong>
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_relative_data')}
            <strong>
              "{t(`domain_operations_nicOperation_${domain?.function}`)}"
            </strong>
          </OdsText>
        </div>

        <div>
          <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.span}>
            <strong>{domainArgument?.description}</strong>
          </OdsText>
          <OdsFileUpload
            onOdsChange={(
              e: OdsFileUploadCustomEvent<OdsFileChangeEventDetail>,
            ) => {
              setUploadedFiles(e.detail.files);
              setCanRelaunch(true);
            }}
            onOdsCancel={() => {
              setUploadedFiles([]);
              setCanRelaunch(false);
              setErrorUpload('');
            }}
            onOdsRejected={(
              e: OdsFileUploadCustomEvent<OdsFileRejectedEventDetail>,
            ) => setErrorUpload(e.detail.reason)}
            error={
              errorUpload && t(`domain_operations_upload_error_${errorUpload}`)
            }
            maxFile={maxFile}
            maxSize={domainArgument?.maximumSize}
            maxSizeLabel={t('domain_operations_upload_max_size_label')}
            accept={`.${domainArgument?.acceptedFormats.join(', ')}`}
            acceptedFileLabel={`${t(
              'domain_operations_upload_accepted_file_types',
            )} ${domainArgument?.acceptedFormats.map(
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
                setCanRelaunch(true);
                setCanCancel(false);
                setCanAccelerate(false);
              }}
              isDisabled={!canRelaunch}
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
              isDisabled={!domain?.canAccelerate}
              onOdsChange={() => {
                setCanAccelerate(true);
                setCanCancel(false);
                setCanRelaunch(false);
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
              isDisabled={!domain?.canCancel}
              onOdsChange={() => {
                setCanCancel(true);
                setCanRelaunch(false);
                setCanAccelerate(false);
              }}
            ></OdsRadio>
            <label
              htmlFor="radio-cancel"
              className="form-field__radio__field__label"
            >
              {t('domain_operations_cancel_title')}
            </label>
          </div>

          {canAccelerate && (
            <OdsMessage color="warning" isDismissible={false}>
              {t('domain_operations_accelerate_warning')}
            </OdsMessage>
          )}

          <div className="flex justify-start gap-x-2">
            <OdsButton
              label={t('wizard_cancel')}
              slot="actions"
              onClick={() => {
                setCanCancel(false);
                setCanRelaunch(false);
                setCanAccelerate(false);
                navigate(urls.domain);
              }}
              variant={ODS_BUTTON_VARIANT.outline}
            />
            <OdsButton
              label={t('wizard_confirm')}
              slot="actions"
              isDisabled={!canRelaunch && !canAccelerate && !canCancel}
              onClick={() => onValidate(domain.id as number)}
            />
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
