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
import { useEffect, useMemo, useRef, useState } from 'react';
import { OdsSelectCustomRenderer } from '@ovhcloud/ods-components';
import { useGetIssueTypes } from '@/api/hooks/useIssuTypes';
import { ISSUE_TYPE_IDS } from '@/constants';
import { useGetServiceOptions } from '@/api/hooks/useServiceOptions';
import { TServiceOption } from '@/api/data/service-option';

export type TProps = {
  type: 'support' | 'credit';
  onConfirm: (formData: string) => void;
  onCancel: () => void;
  onClose: () => void;
  isLoading: boolean;
};

type TState = {
  serviceOption: TServiceOption;
  description: string;
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
  const select = useRef(null);

  const { data: project } = useProject(projectId);

  const [state, setState] = useState<TState>({
    serviceOption: undefined,
    description: '',
  });

  const { data: issueTypes } = useGetIssueTypes(i18n.language);

  const inputLabel = useMemo(() => {
    if (type === 'support' && Array.isArray(issueTypes)) {
      const targetIssueType = issueTypes.find(({ id }) =>
        ISSUE_TYPE_IDS.includes(id),
      );

      if (targetIssueType) {
        return targetIssueType.fields.map(({ label }) => label).join('\n\n');
      }
    }
    return '';
  }, [issueTypes]);

  const { data: serviceOptions } = useGetServiceOptions(projectId);

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

  return (
    <OdsModal isOpen={true} onOdsClose={onClose}>
      <div className="">
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
                value={state.description}
                onOdsChange={(event) => {
                  setState((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }));
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
                setState((prev) => ({ ...prev, serviceOption: target }));
              }}
              customRenderer={selectCustomRenderer}
            >
              {serviceOptions?.map(({ planCode, prices }) => (
                <option key={planCode} value={planCode}>
                  {t(
                    `pci_projects_project_quota_increase_select_volume_${planCode}`,
                  )}{' '}
                  {` - ${prices[0]?.price.text}`}
                </option>
              ))}
            </OdsSelect>
          )}
        </div>
        <div className="mt-8 text-right">
          <OdsButton onClick={onCancel} variant="outline" label="Cancel" />
          <OdsButton
            onClick={() =>
              onConfirm(
                type === 'support'
                  ? state.description
                  : state.serviceOption.planCode,
              )
            }
            label="Confirm"
            className="ml-3"
            isDisabled={
              (type === 'credit' && !state.serviceOption) ||
              (type === 'support' && !state.description)
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </OdsModal>
  );
};
