import { PciModal, useProject } from '@ovh-ux/manager-pci-common';
import { OdsSelectCustomRenderer } from '@ovhcloud/ods-components';
import { OdsMessage, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TServiceOption } from '@/api/data/service-option';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';

export enum Type {
  CREDIT = 'credit',
  SUPPORT = 'support',
}

export type TProps = {
  onConfirm: (formData: string) => void;
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

export const Modal = ({ onConfirm, isLoading }: TProps): JSX.Element => {
  const { t } = useTranslation('quotas/increase');
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project } = useProject(projectId);

  const [serviceOption, setServiceOption] = useState<
    TServiceOption | undefined
  >();

  const { data: serviceOptions } = useGetFilteredServiceOptions(projectId);
  return (
    <PciModal
      title={t('pci_projects_project_quota_increase_title')}
      onConfirm={() => onConfirm(serviceOption.planCode)}
      onClose={() => navigate('..')}
      onCancel={() => navigate('..')}
      isPending={isLoading}
      submitText={t('pci_projects_project_quota_increase_submit_label')}
      cancelText={t('pci_projects_project_quota_increase_cancel_label')}
      isDisabled={isLoading || !serviceOption}
    >
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
    </PciModal>
  );
};
