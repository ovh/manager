import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import pLimit from 'p-limit';
import { toUnicode } from 'punycode';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import SubHeader from '@/components/SubHeader/SubHeader';
import Loading from '@/components/Loading/Loading';
import { updateOperationStatus } from '@/data/api/ongoing-operations-actions';
import { ActionNameEnum } from '@/enum/actionName.enum';
import { ParentEnum } from '@/enum/parent.enum';
import { useOperationArguments } from '@/hooks/update/useOperationArguments';
import { useDomain } from '@/hooks/data/query';
import UpdateContentComponent from '@/components/Update/UpdateContent.component';
import UpdateActions from '@/components/Update/Content/UpdateActions.component';
import { urls } from '@/routes/routes.constant';
import { ContactControlProperties, DomainOperationsEnum } from '@/constants';
import ActionMeDnsComponent from '@/components/Update/Content/Update.Me.Dns.component';
import { processUploadedFiles } from '@/utils/update.utils';
import { updateTask } from '@/data/api/web-ongoing-operations';

export default function Update() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams<{ id: string }>();
  const { product } = useParams<{ product: string }>();
  const [actionName, setActionName] = useState<ActionNameEnum>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
    {},
  );
  const [operationArgumentsUpdated, setOperationArgumentsUpdated] = useState<
    Record<string, string>
  >();
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const paramId = Number(id);
  const updateTaskLimit = pLimit(1);
  const queryClient = useQueryClient();

  const { data: domain, isLoading: domainLoading } = useDomain(paramId);
  const {
    data: operationArguments,
    isLoading: argumentLoading,
  } = useOperationArguments(paramId);
  const { notifications, clearNotifications } = useNotifications();
  const { addError, addSuccess } = useNotifications();

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
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`domain_operations_${actionName}_success`)}
        </Text>,
      );
      navigate(`${urls.root}${product}`);
    },
    onError: () => {
      setIsActionLoading(false);
      addError(<Text>{t('domain_operations_update_error')}</Text>);
    },
  });

  const { mutate: onValidate } = useMutation({
    mutationFn: async () => {
      setIsActionLoading(true);

      if (uploadedFiles && Object.keys(uploadedFiles).length > 0) {
        await processUploadedFiles(paramId, uploadedFiles);
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
      addError(<Text>{t('domain_operations_update_error')}</Text>);
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
          const uploaded = uploadedFiles[arg.key];
          if (!uploaded || uploaded.length === 0) {
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
    return <Loading />;
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
          <Text preset={TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="domain_operation_comment"
              values={{
                t0: domain.comment,
              }}
              components={{ strong: <span className="font-bold" /> }}
            />
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="domain_operation_data"
              values={{
                t0: t(`domain_operations_nicOperation_${domain.function}`),
              }}
              components={{ strong: <span className="font-bold" /> }}
            />
          </Text>
        </div>

        {domain.function === DomainOperationsEnum.DomainDnsUpdate && (
          <div className="flex flex-col gap-y-4">
            <ActionMeDnsComponent domainName={domain.domain} />
          </div>
        )}

        {operationArguments?.data?.length > 0 && (
          <div className="flex flex-col gap-y-4 mb-8">
            {operationArguments?.data?.map((argument, index) => (
              <div key={`${domain.id}-${index}`}>
                <UpdateContentComponent
                  argument={argument}
                  operationId={domain.id}
                  domainName={domain.domain}
                  operationName={domain.function}
                  onChange={onChange}
                  setUploadedFiles={setUploadedFiles}
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
          setActionName={setActionName}
          isActionLoading={isActionLoading}
        />
      </section>
    </BaseLayout>
  );
}
