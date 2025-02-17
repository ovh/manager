import { PciModal, useProject } from '@ovh-ux/manager-pci-common';
import {
  OdsMessage,
  OdsText,
  OdsFormField,
  OdsTextarea,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { OdsSelectCustomRenderer } from '@ovhcloud/ods-components';
import { useGetIssueTypes } from '@/api/hooks/useIssueTypes';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';
import { TServiceOption } from '@/api/data/service-option';
import useInputLabel from '@/hooks/useInputLabel';

export type TProps = {
  type: 'support' | 'credit';
  onConfirm: (formData: string) => void;
  onCancel: () => void;
  onClose: () => void;
  isLoading: boolean;
};

const selectCustomRenderer: OdsSelectCustomRenderer = {
  item: (data: { text: string }) => {
    return `<span>${data.text}</span>`;
  },
  option: (data: { text: string }) => {
    return `<div style="display:flex;"><div style="flex-basis: 50%;">${data.text
      .split('-')[0]
      .trim()}</div><div style="flex-basis: 50%;text-align:right;">${data.text
      .split('-')[1]
      .trim()}</div></div>`;
  },
};

export const Modal = ({
  type,
  onConfirm,
  onClose,
  onCancel,
  isLoading,
}: TProps): JSX.Element => {
  const { t, i18n } = useTranslation('quotas/increase');
  const { projectId } = useParams();

  const { data: project } = useProject(projectId);

  const [serviceOption, setServiceOption] = useState<TServiceOption>();
  const [description, setDescription] = useState<string>();

  const { data: issueTypes } = useGetIssueTypes(i18n.language);

  const inputLabel = useInputLabel(type, issueTypes);

  const { data: serviceOptions } = useGetFilteredServiceOptions(projectId);
  return (
    <PciModal
      title={t('pci_projects_project_quota_increase_title')}
      onConfirm={() =>
        onConfirm(type === 'support' ? description : serviceOption.planCode)
      }
      onClose={onClose}
      onCancel={onCancel}
      isPending={isLoading}
      submitText={t('pci_projects_project_quota_increase_submit_label')}
      cancelText={t('pci_projects_project_quota_increase_cancel_label')}
      isDisabled={
        isLoading ||
        (type === 'credit' && !serviceOption) ||
        (type === 'support' && !description)
      }
    >
      {type === 'credit' && (
        <>
          <OdsText preset="paragraph">
            {t('pci_projects_project_quota_increase_buy_credits')}
          </OdsText>
          <div className="mt-4">
            <OdsMessage color="warning" isDismissible={false}>
              <OdsText>
                {t('pci_projects_project_quota_increase_payment_info')}
              </OdsText>
            </OdsMessage>
          </div>
        </>
      )}
      {/* TODO use interpolation */}
      <OdsText preset="paragraph" className="mt-4">
        <span
          dangerouslySetInnerHTML={{
            __html: t('pci_projects_project_quota_increase_content', {
              projectInfo: `<strong>${project?.description} ${project?.project_id}</strong>`,
            }),
          }}
        ></span>
      </OdsText>
      {type === 'support' && (
        <OdsFormField className="mt-4">
          <OdsText slot="label" className="text-base">
            {inputLabel}
          </OdsText>
          <OdsTextarea
            name="description"
            value={description}
            onOdsChange={(event) => {
              setDescription(event.target.value);
            }}
          ></OdsTextarea>
        </OdsFormField>
      )}
      {type === 'credit' && (
        <div className="mt-6">
          <OdsSelect
            name="service-option"
            placeholder={t('pci_projects_project_quota_increase_select_volume')}
            onOdsChange={(event) => {
              const target = serviceOptions.find(
                (s) => s.planCode === event.target.value,
              );
              setServiceOption(target);
            }}
            customRenderer={selectCustomRenderer}
          >
            {serviceOptions?.map(({ planCode, prices }) => (
              <option key={planCode} value={planCode}>
                {`${t(
                  `pci_projects_project_quota_increase_select_volume_${planCode}`,
                )} - ${prices[0]?.price.text}`}
              </option>
            ))}
          </OdsSelect>
        </div>
      )}
    </PciModal>
  );
};
