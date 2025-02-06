import { BaseLayout, GuideButton } from '@ovh-ux/manager-react-components';
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
  OdsFileUploadCustomEvent,
} from '@ovhcloud/ods-components';
import {
  getmeTaskDomainArgument,
  updateTask,
} from '@/data/api/web-domain-dns-ongoing-operations';
import SubHeader from '@/components/SubHeader';
import { TArgument } from '@/interface';
import { useGetDomainData } from '@/hooks/data/useGetDomainData';
import { saveFile } from '@/data/api/document';
import { useDoOperation } from '@/hooks/actions/useActions';

export default function upload() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { id, type } = useParams<{ id: string; type: string }>();
  const [canRelaunch, setCanRelaunch] = useState<boolean>(false);
  const [canAccelerate, setCanAccelerate] = useState<boolean>(false);
  const [canCancel, setCanCancel] = useState(false);
  const [status, setStatus] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);

  const fetchDomainData = async () => {
    const data = await useGetDomainData(id);
    setCanRelaunch(data?.canRelaunch);
    return data;
  };

  const fetchDomainArgument = async (
    domainId: string,
    argumentType: string,
  ) => {
    const response = await getmeTaskDomainArgument(domainId, argumentType);
    return response.data;
  };

  const { data: domain } = useQuery({
    queryKey: ['domain'],
    queryFn: () => fetchDomainData(),
  });

  const { data: domainArgument } = useQuery<TArgument>({
    queryKey: ['argument'],
    queryFn: () => fetchDomainArgument(id, type),
  });

  const changeStatus = (label: string, message: string) => {
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
    navigate(`/domain`);
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
    changeStatus('success', t('domain_operations_upload_doing'));
    for (let i = 0; i < uploadedFiles.length; i += 1) {
      promiseArray.push(
        saveFileAndUpdateOperation(operationID, uploadedFiles[i]),
      );
    }
    Promise.all(promiseArray)
      .then(async () => {
        changeStatus('success', t('domain_operations_upload_success'));
        executeActionOnOperation(operationID);
      })
      .catch(() => {
        changeStatus('error', t('domain_operations_upload_error'));
      });
  };
  return (
    <BaseLayout
      header={{
        headerButton: (
          <GuideButton
            items={[
              {
                href: 'https://www.ovh.com',
                id: 1,
                label: 'ovh.com',
                target: '_blank',
              },
              {
                href:
                  'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
                id: 2,
                label: 'Guides OVH',
                target: '_blank',
              },
            ]}
          />
        ),
        title: t('domain_operations_dashboard_title'),
      }}
    >
      {status === 'success' && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.success}
          onOdsRemove={() => changeStatus('', '')}
          className="mb-4 w-full"
        >
          {statusMessage}
        </OdsMessage>
      )}

      {status === 'error' && (
        <OdsMessage
          color={ODS_MESSAGE_COLOR.warning}
          onOdsRemove={() => changeStatus('', '')}
          className="mb-4 w-full"
        >
          {statusMessage}
        </OdsMessage>
      )}

      <SubHeader domain={domain} />
      <section>
        <div className="flex flex-col gap-y-1 mb-6">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            Commentaire de l'opération
            <strong> {domain?.comment}</strong>
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            Vous pouvez modifier les données relatives à l'opération{' '}
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
            }}
            maxFile={1}
            maxSize={domainArgument?.maximumSize}
            maxSizeLabel="No file larger than"
            accept=".jpg,.jpeg"
            acceptedFileLabel={`Accepted file types : ${domainArgument?.acceptedFormats.map(
              (e: string) => {
                return `${e} `;
              },
            )}`}
            files={uploadedFiles}
            className="w-[384px]"
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
                navigate('..');
              }}
              variant={ODS_BUTTON_VARIANT.outline}
            />
            <OdsButton
              label={t('wizard_confirm')}
              slot="actions"
              isDisabled={!canRelaunch && !canAccelerate && !canCancel}
              onClick={() => onValidate(domain.id)}
            />
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
