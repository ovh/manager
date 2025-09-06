import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, OdsFile } from '@ovhcloud/ods-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { toUnicode } from 'punycode';
import { updateTask } from '@/data/api/web-ongoing-operations';
import SubHeader from '@/components/SubHeader/SubHeader';
import { saveFile } from '@/data/api/document';
import Loading from '@/components/Loading/Loading';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { ActionNameEnum } from '@/enum/actionName.enum';
import { ParentEnum } from '@/enum/parent.enum';
import { useOperationArguments } from '@/hooks/update/useOperationArguments';
import { useDomain } from '@/hooks/data/query';
import UpdateContentComponent from '@/components/Update/UpdateContent.component';
import UpdateActions from '@/components/Update/Content/UpdateActions.component';
import { TFiles } from '@/types';
import { urls } from '@/routes/routes.constant';
import { DomainOperationsEnum } from '@/constants';
import ActionMeDnsComponent from '@/components/Update/Content/Update.Me.Dns.component';

export default function Update() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const { product } = useParams<{ product: string }>();
  const [actionName, setActionName] = useState<ActionNameEnum>(null);
  const [uploadedFiles, setUploadedFiles] = useState<TFiles[]>([]);
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const paramId = Number(id);
  const limit = pLimit(1);
  const updateTaskLimit = pLimit(1);
  const queryClient = useQueryClient();

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);
  const {
    data: operationArguments,
    isLoading: argumentLoading,
  } = useOperationArguments(paramId);
  const { notifications, clearNotifications } = useNotifications();
  const { addError, addSuccess } = useNotifications();

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

  const updateActionName = (label: ActionNameEnum) => {
    setActionName(label);
  };

  const { mutate: executeActionOnOperation } = useMutation({
    mutationFn: async (operationID: number) => {
      clearNotifications();
      await updateOperationStatus(ParentEnum.DOMAIN, operationID, actionName);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['me', 'task'],
      });
      setIsActionLoading(false);
      clearNotifications();
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`domain_operations_${actionName}_success`)}
        </OdsText>,
      );
      navigate(`${urls.root}${product}`);
    },
    onError: () => {
      setIsActionLoading(false);
      addError(<OdsText>{t('domain_operations_update_error')}</OdsText>);
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
    mutationFn: async () => {
      setIsActionLoading(true);
      if (uploadedFiles) {
        await processUploadedFiles(paramId);
      }
      if (operationArgumentsUpdated) {
        const promises = Object.entries(
          operationArgumentsUpdated,
        ).map(([key, value]) =>
          updateTaskLimit(() => updateTask(paramId, key, { value })),
        );
        await Promise.all(promises);
      }
    },
    onSuccess: async () => {
      executeActionOnOperation(paramId);
    },
    onError: () => {
      setIsActionLoading(false);
      addError(<OdsText>{t('domain_operations_update_error')}</OdsText>);
    },
  });

  const onChange = (key: string, value: string) => {
    setOperationArgumentsUpdated({
      ...operationArgumentsUpdated,
      [key]: value,
    });
  };

  const isButtonDisabled = useMemo(() => {
    if (!actionName || !operationArguments) return true;

    if (actionName === ActionNameEnum.CanCancel) {
      return false;
    }

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
    actionName,
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
          t0: toUnicode(domain.domain),
        })}
      />
      <section>
        <div className="flex flex-col gap-y-1 mb-8">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="domain_operation_comment"
              values={{
                t0: domain.comment,
              }}
              components={{ strong: <strong /> }}
            />
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="domain_operation_data"
              values={{
                t0: t(`domain_operations_nicOperation_${domain.function}`),
              }}
              components={{ strong: <strong /> }}
            />
          </OdsText>
        </div>

        {domain.function === DomainOperationsEnum.DomainDnsUpdate && (
          <div className="flex flex-col gap-y-4">
            <ActionMeDnsComponent domainName={domain.domain} />
          </div>
        )}

        {operationArguments?.data?.length > 0 && (
          <div className="flex flex-col gap-y-4">
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
        )}

        <UpdateActions
          data={domain}
          actionName={actionName}
          disabled={isButtonDisabled}
          onValidate={onValidate}
          updateActionName={updateActionName}
          isActionLoading={isActionLoading}
        />
      </section>
    </BaseLayout>
  );
}
