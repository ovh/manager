import { useProject } from '@ovh-ux/manager-pci-common';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
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

  // TODO move outside the component

  return (
    <OdsModal isOpen={true} onOdsClose={onClose}>
      <div>
        <div>
          <OdsText preset="heading-4">
            {t('pci_projects_project_quota_increase_title')}
          </OdsText>
        </div>
        <div className="mt-8">
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
            <OdsSelect
              className="mt-8"
              name="service-option"
              placeholder={t(
                'pci_projects_project_quota_increase_select_volume',
              )}
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
          )}
        </div>
        <div className="mt-8 text-right">
          <OdsButton
            onClick={onCancel}
            variant="outline"
            label={t('pci_projects_project_quota_increase_cancel_label')}
          />
          <OdsButton
            onClick={() =>
              onConfirm(
                type === 'support' ? description : serviceOption.planCode,
              )
            }
            label={t('pci_projects_project_quota_increase_submit_label')}
            className="ml-3"
            isDisabled={
              (type === 'credit' && !serviceOption) ||
              (type === 'support' && !description)
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </OdsModal>
  );
};
