import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsCard, OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { DOMAIN_ORDER_URL, REGION } from '@/constants';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<typeof websiteFormSchema>;

interface DomainAssociationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible: boolean;
}

export const DomainAssociation: React.FC<DomainAssociationProps> = ({
  control,
  controlValues,
  setStep,
  isNextButtonVisible,
}: DomainAssociationProps) => {
  const { t } = useTranslation(['common', 'multisite', 'dashboard']);
  const context = useContext(ShellContext);
  const navigate = useNavigate();

  const region = context.environment.getRegion();
  const { ovhSubsidiary } = context.environment.getUser();
  const rawOrderFormURL =
    DOMAIN_ORDER_URL?.[region as keyof typeof DOMAIN_ORDER_URL]?.[
      ovhSubsidiary as keyof (typeof DOMAIN_ORDER_URL)[REGION]
    ];

  const onContinue = () => {
    if (controlValues.associationType === AssociationType.ORDER) {
      window.open(rawOrderFormURL, '_blank');
      navigate(-1);
    }
    setStep(2);
  };

  return (
    <div className="flex flex-col space-y-5">
      <Controller
        name="associationType"
        control={control}
        render={({ field }) => (
          <div className="flex flex-row space-x-4">
            <OdsCard
              className="w-1/3 p-4"
              color={
                controlValues.associationType === AssociationType.EXISTING
                  ? ODS_CARD_COLOR.primary
                  : ODS_CARD_COLOR.neutral
              }
            >
              <div className="flex gap-4 items-center">
                <OdsRadio
                  name={AssociationType.EXISTING}
                  value={AssociationType.EXISTING}
                  isChecked={field.value === AssociationType.EXISTING}
                  onOdsChange={() => field.onChange(AssociationType.EXISTING)}
                />
                <label>
                  <OdsText preset={ODS_TEXT_PRESET.heading6}>
                    {t('multisite:multisite_add_website_existing_domain_card_title')}
                  </OdsText>
                </label>
              </div>
              <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                {t('multisite:multisite_add_website_existing_domain_card_text')}
              </OdsText>
            </OdsCard>
            <OdsCard
              className="w-1/3 p-4"
              color={
                controlValues.associationType === AssociationType.EXTERNAL
                  ? ODS_CARD_COLOR.primary
                  : ODS_CARD_COLOR.neutral
              }
            >
              <div className="flex gap-4 items-center">
                <OdsRadio
                  name={AssociationType.EXTERNAL}
                  value={AssociationType.EXTERNAL}
                  isChecked={field.value === AssociationType.EXTERNAL}
                  onOdsChange={() => field.onChange(AssociationType.EXTERNAL)}
                />
                <label>
                  <OdsText preset={ODS_TEXT_PRESET.heading6}>
                    {t('multisite:multisite_add_website_external_domain_card_title')}
                  </OdsText>
                </label>
              </div>
              <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                {t('multisite:multisite_add_website_external_domain_card_text')}
              </OdsText>
            </OdsCard>
            <OdsCard
              className="w-1/3 p-4"
              color={
                controlValues.associationType === AssociationType.ORDER
                  ? ODS_CARD_COLOR.primary
                  : ODS_CARD_COLOR.neutral
              }
            >
              <div className="flex gap-4 items-center">
                <OdsRadio
                  name={AssociationType.ORDER}
                  value={AssociationType.ORDER}
                  isChecked={field.value === AssociationType.ORDER}
                  onOdsChange={() => field.onChange(AssociationType.ORDER)}
                />
                <label>
                  <OdsText preset={ODS_TEXT_PRESET.heading6}>
                    {t('dashboard:hosting_dashboard_add_or_order_step1_order')}
                  </OdsText>
                </label>
              </div>
              <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                {t('multisite:multisite_add_website_order_domain_card_text')}
              </OdsText>
            </OdsCard>
          </div>
        )}
      />
      {isNextButtonVisible && (
        <OdsButton
          isDisabled={!controlValues.associationType}
          label={t('common:web_hosting_common_action_continue')}
          onClick={onContinue}
        ></OdsButton>
      )}
    </div>
  );
};
