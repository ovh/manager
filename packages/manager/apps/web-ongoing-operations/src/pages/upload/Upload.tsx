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
import { useDomain, useNicList } from '@/hooks/data/query';
import FileUpload from '@/components/Upload/FileUpload';

export default function Upload() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const [operationName, setOperationName] = useState<OperationName>(null);
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);
  const defaultStatus = { label: '', message: '' };
  const [status, setStatus] = useState(defaultStatus);
  const paramId = Number(id);
  const maxFile = 1;

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);
  const {
    data: operationArguments,
    isLoading: argumentLoading,
  } = useOperationArguments(paramId);
  const { data: nicList } = useNicList(paramId);

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
    file: OdsFile,
  ) => {
    const documentId = await saveFile(file);
    const body = { value: documentId };
    nicList.forEach((nic) => updateTask(operationID, nic, body));
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

  const addFileUpload = (file: OdsFile[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...file]);
  };

  const removeFileUpload = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((item) => item.name !== fileName));
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
              addFileUpload={addFileUpload}
              removeFileUpload={removeFileUpload}
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
          disabled={uploadedFiles.length !== operationArguments.data.length}
          onValidate={onValidate}
          putOperationName={putOperationName}
          justify="start"
        />
      </section>
    </BaseLayout>
  );
}
