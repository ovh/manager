import { useContext } from 'react';

import { useNavigate } from 'react-router-dom';

import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Button,
  CARD_COLOR,
  Card,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { DOMAIN_ORDER_URL, REGION } from '@/constants';
import { AssociationType } from '@/data/types/product/website';
import { websiteFormSchema } from '@/utils/formSchemas.utils';

type FormData = z.infer<ReturnType<typeof websiteFormSchema>>;

interface DomainAssociationProps {
  control: Control<FormData, unknown, FormData>;
  controlValues: FormData;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isNextButtonVisible: boolean;
  reset?: (values?: Partial<FormData>) => void;
  isAddingDomain?: boolean;
}

export const DomainAssociation: React.FC<DomainAssociationProps> = ({
  control,
  controlValues,
  setStep,
  isNextButtonVisible,
  reset,
  isAddingDomain = false,
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
          <RadioGroup value={field.value} onChange={field.onChange}>
            <div className="flex flex-row space-x-4">
              <Card
                onClick={() => {
                  reset?.({
                    associationType: AssociationType.EXISTING,
                    autoConfigureDns: true,
                    path: controlValues.path || 'public_html',
                    fqdn: '',
                    name: isAddingDomain ? controlValues.name : '',
                  });
                  setStep(1);
                }}
                className="w-1/3 p-4"
                color={
                  controlValues.associationType === AssociationType.EXISTING
                    ? CARD_COLOR.primary
                    : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={AssociationType.EXISTING}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_existing_domain_card_title')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="ml-8 mt-4">
                  <Text preset={TEXT_PRESET.caption}>
                    {t('multisite:multisite_add_website_existing_domain_card_text')}
                  </Text>
                </div>
              </Card>
              <Card
                className="w-1/3 p-4"
                onClick={() => {
                  reset?.({
                    associationType: AssociationType.EXTERNAL,
                    fqdn: '',
                    name: isAddingDomain ? controlValues.name : '',
                    path: controlValues.path || 'public_html',
                  });
                  setStep(1);
                }}
                color={
                  controlValues.associationType === AssociationType.EXTERNAL
                    ? CARD_COLOR.primary
                    : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={AssociationType.EXTERNAL}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('multisite:multisite_add_website_external_domain_card_title')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="ml-8 mt-4">
                  <Text preset={TEXT_PRESET.caption}>
                    {t('multisite:multisite_add_website_external_domain_card_text')}
                  </Text>
                </div>
              </Card>
              <Card
                className="w-1/3 p-4"
                onClick={() => {
                  field.onChange(AssociationType.ORDER);
                  setStep(1);
                }}
                color={
                  controlValues.associationType === AssociationType.ORDER
                    ? CARD_COLOR.primary
                    : CARD_COLOR.neutral
                }
              >
                <div className="flex items-center gap-4">
                  <Radio value={AssociationType.ORDER}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.heading6}>
                        {t('dashboard:hosting_dashboard_add_or_order_step1_order')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="ml-8 mt-4">
                  <Text preset={TEXT_PRESET.caption}>
                    {t('multisite:multisite_add_website_order_domain_card_text')}
                  </Text>
                </div>
              </Card>
            </div>
          </RadioGroup>
        )}
      />
      {isNextButtonVisible && (
        <div>
          <Button disabled={!controlValues.associationType} onClick={onContinue}>
            {t('common:web_hosting_common_action_continue')}
          </Button>
        </div>
      )}
    </div>
  );
};
