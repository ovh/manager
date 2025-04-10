import { BaseLayout } from '@ovh-ux/manager-react-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  OdsFile,
} from '@ovhcloud/ods-components';
import { useMutation } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { updateTask } from '@/data/api/web-ongoing-operations';
import SubHeader from '@/components/SubHeader/SubHeader';
import { saveFile } from '@/data/api/document';
import Loading from '@/components/Loading/Loading';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { OperationName } from '@/enum/operationName.enum';
import { ParentEnum } from '@/enum/parent.enum';
import OperationActions from '@/components/Actions/OperationsActions.component';
import Notification from '@/components/Notification/Notification.component';
import { useOperationArguments } from '@/hooks/modal/useOperationArguments';
import { useDomain } from '@/hooks/data/query';
import FileUpload from '@/components/Upload/FileUpload';
import { TFiles } from '@/types';

export default function Upload() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const [operationName, setOperationName] = useState<OperationName>(null);
  const [uploadedFiles, setUploadedFiles] = useState<TFiles[]>([]);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const paramId = Number(id);
  const maxFile = 1;
  const limit = pLimit(1);

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);
  const {
    data: operationArguments,
    isLoading: argumentLoading,
  } = useOperationArguments(paramId);

  const putOperationName = (label: OperationName) => {
    setOperationName(label);
  };

  const { mutate: executeActionOnOperation } = useMutation({
    mutationFn: (operationID: number) =>
      updateOperationStatus(ParentEnum.DOMAIN, operationID, operationName),
    onSuccess: () => {
      setStatus({
        label: ODS_MESSAGE_COLOR.success,
        message: t(`domain_operations_update_${operationName}`),
      });
    },
    onError: () => {
      setStatus({
        label: ODS_MESSAGE_COLOR.warning,
        message: t('domain_operations_upload_error'),
      });
    },
  });

  const saveFileAndUpdateOperation = async (
    operationID: number,
    key: string,
    file: OdsFile,
  ) => {
    const documentId = await saveFile(file);
    const body = { value: documentId };
    updateTask(operationID, key, body);
  };

  const processFile = async (
    file: OdsFile,
    key: string,
    operationID: number,
  ) => {
    return limit(() => saveFileAndUpdateOperation(operationID, key, file));
  };

  const processUploadedFiles = async (operationID: number) => {
    setStatus({
      label: ODS_MESSAGE_COLOR.information,
      message: t('domain_operations_upload_doing'),
    });

    const tasks = uploadedFiles.flatMap((files) => {
      return files.data.map((file) =>
        processFile(file, files.key, operationID),
      );
    });
    await Promise.all(tasks);
  };

  const { mutate: onValidate } = useMutation({
    mutationFn: async (operationID: number) => {
      await processUploadedFiles(operationID);
      return { operationID };
    },
    onSuccess: (data) => {
      const { operationID } = data;
      setStatus({
        label: ODS_MESSAGE_COLOR.success,
        message: t('domain_operations_upload_success'),
      });
      executeActionOnOperation(operationID);
    },
    onError: () => {
      setStatus({
        label: ODS_MESSAGE_COLOR.warning,
        message: t('domain_operations_upload_error'),
      });
    },
  });

  const addFileUpload = (key: string, data: OdsFile[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, { key, data } as TFiles]);
  };

  const removeFileUpload = (key: string, fileName: string) => {
    setUploadedFiles(
      uploadedFiles.map((f) => {
        if (f.key === key) {
          const res = f;
          res.data = f.data.filter((file) => file.name !== fileName);
          return res;
        }
        return f;
      }),
    );
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
        <Notification
          label={status.label}
          message={status.message}
          removeMessage={() => setStatus(defaultStatus)}
        />
      )}

      <SubHeader
        title={t('domain_operations_upload_title', {
          t0: domain?.domain,
        })}
      />
      <section>
        <div className="flex flex-col gap-y-1 mb-6">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_comment')}
            <strong>{domain.comment}</strong>
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('domain_operation_data')}
            <strong>
              "{t(`domain_operations_nicOperation_${domain.function}`)}"
            </strong>
          </OdsText>
        </div>

        <div className="flex flex-col gap-y-4">
          {operationArguments?.data.map((argument) => (
            <FileUpload
              key={argument.key}
              argument={argument}
              addFileUpload={(files: OdsFile[]) =>
                addFileUpload(argument.key, files)
              }
              removeFileUpload={(fileName: string) => {
                removeFileUpload(argument.key, fileName);
              }}
              maxFile={maxFile}
            />
          ))}
        </div>

        <OdsDivider
          color={ODS_DIVIDER_COLOR.light}
          spacing={ODS_DIVIDER_SPACING._48}
        />

        <OperationActions
          data={domain}
          operationName={operationName}
          disabled={uploadedFiles.length === 0 || operationName === null}
          onValidate={(operationId) => onValidate(operationId)}
          putOperationName={putOperationName}
          justify="start"
        />
      </section>
    </BaseLayout>
  );
}
