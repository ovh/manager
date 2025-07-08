import { Modal, Subtitle } from '@ovh-ux/manager-react-components';
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
import {
  PromotionPrice,
  PromotionLineThroughPrice,
} from '../Commitment/PromotionPrice';
import CommitmentMonth from '../Commitment/CommitmentMonth';

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

const CreatePlanConfirmModal = ({
  isModalOpen,
  setIsModalOpen,
  onCreateSavingsPlan,
  savingsPlanInfo,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  onCreateSavingsPlan: () => void;
  savingsPlanInfo: {
    name: string;
    duration: number;
    resource: string;
    deploymentMode: DeploymentMode;
    model: string;
    quantity: number;
    monthlyPercentageDiscount: number;
    monthlyPrice: string;
    monthlyPriceWithoutDiscount: string;
  };
}) => {
  const { t } = useTranslation('create');

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

  return (
    <Modal
      isOpen={isModalOpen}
      onDismiss={() => setIsModalOpen(false)}
      secondaryLabel={t('modal_secondary_label')}
      onSecondaryButtonClick={() => setIsModalOpen(false)}
      title={t('modal_title')}
      content={t('modal_content')}
      primaryLabel={t('cta_plan')}
      isPrimaryButtonDisabled={!isLegalChecked}
      onPrimaryButtonClick={onPrimaryButtonClick}
    >
      <div className="flex flex-col gap-4">
        <Subtitle>{t('modal_summary_title')}</Subtitle>
        <OdsMessage>{t('modal_content')}</OdsMessage>
        <BoldLabelText label={t('modal_summary_label_name')} value={name} />
        <BoldLabelText
          label={t('modal_summary_label_deployment_mode')}
          value={deploymentMode}
        />
        <BoldLabelText
          label={t('modal_summary_label_service')}
          value={savingsPlanInfo.resource}
        />
        <BoldLabelText
          label={t('modal_summary_label_model')}
          value={savingsPlanInfo.model}
        />
        <BoldLabelText
          label={t('modal_summary_label_quantity')}
          value={savingsPlanInfo.quantity}
        />
        <div className="flex flex-row gap-2">
          <OdsText preset="heading-6">
            {t('modal_summary_label_commitment_duration')}
          </OdsText>
          <CommitmentMonth duration={savingsPlanInfo.duration} />
          <PromotionPrice price={`- ${monthlyPercentageDiscount} %`} />
        </div>

        <hr />
        <div className="flex flex-row justify-between">
          <OdsText>{t('modal_summary_label_total_price')}</OdsText>
          <div>
            <PromotionLineThroughPrice
              price={`~ ${monthlyPriceWithoutDiscount}`}
            />
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
