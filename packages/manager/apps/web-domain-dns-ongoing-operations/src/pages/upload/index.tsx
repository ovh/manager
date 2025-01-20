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
} from '@ovhcloud/ods-components';
import {
  getmeTaskDomainArgument,
  getmeTaskDomainId,
} from '@/data/api/web-domain-dns-ongoing-operations';
import SubHeader from '@/components/SubHeader';
import { TArgument } from '@/interface';
import { useDoOperation } from '@/hooks/actions/useActions';

export default function upload() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { type } = useParams<{ type: string }>();
  const [canRelaunch, setCanRelaunch] = useState<boolean>(false);
  const [canAccelerate, setCanAccelerate] = useState<boolean>(false);
  const [canCancel, setCanCancel] = useState(false);
  const [status, setStatus] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);

  const fetchDomainData = async (routeId: string) => {
    const response = await getmeTaskDomainId(id);
    return response.data;
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
    queryFn: () => fetchDomainData(id),
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

  const handleOperation = async (
    universe: string,
    domainId: number,
    operation: string,
  ) => {
    try {
      const response = await useDoOperation('domain', domainId, operation);
      if (response.status === 200) {
        changeStatus('success', 'Operation done with success');
      }
      const file = uploadedFiles[0];
      if (file) {
        const data = new FormData();
        data.append('file', file);
        console.log(data);
      }
    } catch (e) {
      changeStatus('error', 'Operation done with error');
    }
  };

  const handleFileChange = (files: OdsFile[] | OdsFile) => {
    const updatedFiles: OdsFile[] = files?.detail.files;
    setUploadedFiles(updatedFiles);
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
            <strong>{domain?.comment}</strong>
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
            onOdsChange={(files: OdsFile[]) => handleFileChange(files)}
            onOdsCancel={() => setUploadedFiles([])}
            maxFile={1}
            accept=".jpg,.png,.pdf"
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
              isDisabled={!domain?.canRelaunch}
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
              onClick={() =>
                handleOperation('domain', domain?.id, operationType())
              }
            />
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}
