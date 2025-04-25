import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, OdsFile } from '@ovhcloud/ods-components';
import { useMutation } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { updateTask } from '@/data/api/web-ongoing-operations';
import SubHeader from '@/components/SubHeader/SubHeader';
import { saveFile } from '@/data/api/document';
import Loading from '@/components/Loading/Loading';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { OperationName } from '@/enum/operationName.enum';
import { ParentEnum } from '@/enum/parent.enum';
import { useOperationArguments } from '@/hooks/update/useOperationArguments';
import { useDomain } from '@/hooks/data/query';
import UpdateContentComponent from '@/components/Update/UpdateContent.component';
import UpdateActions from '@/components/Update/Content/UpdateActions.component';
import { TFiles } from '@/types';
import { urls } from '@/routes/routes.constant';

export default function Update() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const [operationName, setOperationName] = useState<OperationName>(null);
  const [uploadedFiles, setUploadedFiles] = useState<TFiles[]>([]);
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const navigate = useNavigate();
  const paramId = Number(id);
  const limit = pLimit(1);
  const updateTaskLimit = pLimit(1);

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);
  const {
    data: operationArguments,
    isLoading: argumentLoading,
  } = useOperationArguments(paramId);
  const { notifications, clearNotifications } = useNotifications();
  const { addError, addSuccess, addInfo } = useNotifications();

  const addFileUpload = (key: string, data: OdsFile[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, { key, data } as TFiles]);
  };

  const removeFileUpload = (key: string, fileName: string) => {
    setUploadedFiles(
      uploadedFiles.filter((f) => {
        if (f.key === key) {
          const res = f;
          res.data = f.data.filter((file) => file.name !== fileName);
          if (res.data.length > 0) {
            return res;
          }
          return null;
        }
        return f;
      }),
    );
  };

  const putOperationName = (label: OperationName) => {
    setOperationName(label);
  };

  const { mutate: executeActionOnOperation } = useMutation({
    mutationFn: (operationID: number) =>
      updateOperationStatus(ParentEnum.DOMAIN, operationID, operationName),
    onSuccess: () => {
      addSuccess(
        <OdsText>{t(`domain_operations_update_${operationName}`)}</OdsText>,
      );
    },
    onError: () => {
      addError(<OdsText>{t('domain_operations_upload_error')}</OdsText>);
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
    const tasks = uploadedFiles.flatMap((files) => {
      return files.data.map((file) =>
        processFile(file, files.key, operationID),
      );
    });
    await Promise.all(tasks);
  };

  const { mutate: onValidate } = useMutation({
    mutationFn: async (operationID: number) => {
      addInfo(<OdsText>{t('domain_operations_upload_doing')}</OdsText>);
      await processUploadedFiles(operationID);
      if (operationArgumentsUpdated) {
        const promises = Object.entries(
          operationArgumentsUpdated,
        ).map(([key, value]) =>
          updateTaskLimit(() => updateTask(operationID, key, { value })),
        );
        await Promise.all(promises);
      }
      return { operationID };
    },
    onSuccess: (data) => {
      const { operationID } = data;
      clearNotifications();
      addSuccess(<OdsText>{t('domain_operations_upload_success')}</OdsText>);
      executeActionOnOperation(operationID);
    },
    onError: () => {
      addError(<OdsText>{t('domain_operations_upload_error')}</OdsText>);
    },
    onSettled: () => {
      setTimeout(() => {
        navigate(urls.root);
        clearNotifications();
      }, 4000);
    },
  });

  const onChange = (key: string, value: string) => {
    setOperationArgumentsUpdated({
      ...operationArgumentsUpdated,
      [key]: value,
    });
  };

  const isButtonDisabled = useMemo(() => {
    if (!operationName || !operationArguments) return true;

    let isValid = true;

    operationArguments.data.forEach((arg) => {
      switch (arg.type) {
        case '/me/document': {
          const uploaded = uploadedFiles.find((f) => f.key === arg.key);
          if (!uploaded || !uploaded.data.length) {
            isValid = false;
          }
          break;
        }
        case 'string': {
          const updatedValue = operationArgumentsUpdated?.[arg.key];
          if (!updatedValue || updatedValue.trim() === '') {
            isValid = false;
          }
          break;
        }
        default:
          break;
      }
    });

    return !isValid;
  }, [
    operationName,
    operationArguments,
    uploadedFiles,
    operationArgumentsUpdated,
  ]);

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
      message={notifications.length ? <Notifications /> : null}
    >
      <SubHeader
        title={t('domain_operations_update_title', {
          t0: domain.domain,
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

        <div className="my-6 flex flex-col gap-y-4">
          {operationArguments?.data?.map((argument, index) => (
            <div key={`${domain.id}-${index}`}>
              <UpdateContentComponent
                argument={argument}
                operationId={domain.id}
                domainName={domain.domain}
                operationName={domain.function}
                onChange={onChange}
                addFileUpload={addFileUpload}
                removeFileUpload={removeFileUpload}
              />
            </div>
          ))}
        </div>

        <UpdateActions
          data={domain}
          operationName={operationName}
          disabled={isButtonDisabled}
          onValidate={(operationId) => onValidate(operationId)}
          putOperationName={putOperationName}
        />
      </section>
    </BaseLayout>
  );
}
