import { Modal, useFormatDate } from '@ovh-ux/manager-react-components';
import {
  OdsCheckbox,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Block } from '../SimpleTile/SimpleTile';
import LegalLinks from '../LegalLinks/LegalLinks';
import { DeploymentMode } from '@/utils/savingsPlan';
import { PromotionPrice, OriginalPrice } from '../Commitment/PromotionPrice';
import CommitmentMonth from '../Commitment/CommitmentMonth';
import { Resource, ResourceType } from '@/types/CreatePlan.type';
import { getResources } from '@/utils/resource';

const BoldLabelText = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex flex-row gap-2">
      <OdsText preset="heading-6">{label}&nbsp;:</OdsText>
      <OdsText className="ml-1">{value}</OdsText>
    </div>
  );
};

type TSavingsPlanInfo = {
  name: string;
  duration: number;
  resource: ResourceType;
  deploymentMode: DeploymentMode;
  model: string;
  startDate: Date;
  quantity: number;
  monthlyPercentageDiscount: string;
  monthlyPrice: string;
  monthlyPriceWithoutDiscount: string;
};

type CreatePlanConfirmModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onCreateSavingsPlan: () => void;
  savingsPlanInfo: TSavingsPlanInfo;
};

const CreatePlanConfirmModal = ({
  isModalOpen,
  setIsModalOpen,
  onCreateSavingsPlan,
  savingsPlanInfo,
}: CreatePlanConfirmModalProps) => {
  const { t } = useTranslation('create');
  const formatDate = useFormatDate();
  const [isLegalChecked, setIsLegalChecked] = useState(false);

  const onPrimaryButtonClick = () => {
    if (isLegalChecked) {
      onCreateSavingsPlan();
    }
  };

  const {
    monthlyPercentageDiscount,
    monthlyPrice,
    monthlyPriceWithoutDiscount,
    deploymentMode,
    name,
  } = savingsPlanInfo;

  const resources: Resource[] = getResources(t);
  const resourceLabel = resources.find(
    (r) => r.value === savingsPlanInfo.resource,
  )?.label;

  const isInstance = savingsPlanInfo.resource === ResourceType.instance;
  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setIsModalOpen(false)}
      secondaryLabel={t('modal_secondary_label')}
      onSecondaryButtonClick={() => setIsModalOpen(false)}
      heading={t('modal_title')}
      primaryLabel={t('cta_plan')}
      isPrimaryButtonDisabled={!isLegalChecked}
      onPrimaryButtonClick={onPrimaryButtonClick}
    >
      <div className="flex flex-col gap-4">
        <OdsMessage isDismissible={false}>{t('modal_content')}</OdsMessage>
        <BoldLabelText label={t('modal_summary_label_name')} value={name} />
        {savingsPlanInfo.resource === ResourceType.instance && (
          <BoldLabelText
            label={t('modal_summary_label_deployment_mode')}
            value={`${t('region')} ${deploymentMode}`}
          />
        )}
        <BoldLabelText
          label={t('modal_summary_label_service')}
          value={resourceLabel}
        />
        <BoldLabelText
          label={t('modal_summary_label_model')}
          value={savingsPlanInfo.model}
        />
        <BoldLabelText
          label={t(`quantity_label_${isInstance ? 'instance' : 'rancher'}`)}
          value={savingsPlanInfo.quantity}
        />

        <div className="flex flex-row gap-2">
          <OdsText preset="heading-6">
            {t('modal_summary_label_commitment_duration')}
          </OdsText>
          <CommitmentMonth duration={savingsPlanInfo.duration} />
          <PromotionPrice price={`- ${monthlyPercentageDiscount} %`} />
        </div>
        <BoldLabelText
          label={t(`modal_summary_label_start_date`)}
          value={formatDate({ date: savingsPlanInfo.startDate })}
        />
        <hr />
        <div className="flex flex-row justify-between">
          <OdsText>{t('modal_summary_label_total_price')}</OdsText>
          <div>
            <OriginalPrice price={`~ ${monthlyPriceWithoutDiscount}`} />
            <PromotionPrice price={monthlyPrice} />
          </div>
        </div>

        <hr />
        <Block className="flex flex-row gap-2">
          <OdsCheckbox
            inputId="checkbox-label"
            className="mr-4"
            name="legal-checked"
            isChecked={isLegalChecked}
            onClick={() => setIsLegalChecked(!isLegalChecked)}
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="checkbox-label">
              <OdsText>{t('legal_checkbox')}</OdsText>
            </label>
            <LegalLinks className="mr-[5px]" />
          </div>
        </Block>
      </div>
    </Modal>
  );
};

export default CreatePlanConfirmModal;
