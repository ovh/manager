import {
  ActionBanner,
  Description,
  LinkType,
  Links,
  Subtitle,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TILE_VARIANT,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsInput,
  OsdsSpinner,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import React, { FC, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import useTechnicalInfo, { usePricingInfo } from '@/hooks/useCatalogCommercial';
import { formatPricingInfo } from '@/utils/formatter/formatter';
import rancherSrc from '../../assets/images/rancher.png';
import serviceSrc from '../../assets/images/service.png';
import Commitment from '../Commitment/Commitment';
import SimpleTile from '../SimpleTile/SimpleTile';
import { TileTechnicalInfo } from '../TileTechnicalInfo/TileTechnicalInfo';
import {
  InstanceInfo,
  InstanceTechnicalName,
  Resource,
  ResourceType,
} from './CreatePlan.type';

export const isValidName = (name: string) =>
  /^[a-z0-9][-_.A-Za-z0-9]{1,61}$/.test(name);

export const DescriptionWrapper: React.FC<{
  children: string;
}> = ({ children }) => {
  return (
    <div className="my-3">
      <Description>{children}</Description>
    </div>
  );
};

const Block: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="my-8">{children}</div>;
};

type CreatePlanFormProps = {
  instancesInfo: InstanceInfo[];
  resources: Resource[];
  instanceCategory: InstanceTechnicalName;
  setInstanceCategory: (category: InstanceTechnicalName) => void;
  pricingByDuration: ReturnType<typeof formatPricingInfo>[];
  isPricingLoading: boolean;
  isTechnicalInfoLoading: boolean;
  technicalModel: string;
  setTechnicalModel: (technicalModel: string) => void;
};

export const getDescriptionInstanceKey = (resource: string) => {
  return `select_model_description_instance_${resource}`;
};

const CreatePlanForm: FC<CreatePlanFormProps> = ({
  instancesInfo,
  resources,
  instanceCategory,
  setInstanceCategory,
  pricingByDuration,
  isPricingLoading,
  isTechnicalInfoLoading,
  technicalModel,
  setTechnicalModel,
}: CreatePlanFormProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('create');
  const [selectedResource, setSelectedResource] = useState<ResourceType>(
    ResourceType.instance,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [planName, setPlanName] = useState<string>('');
  const [isLegalChecked, setIsLegalChecked] = useState<boolean>(false);

  const isInstance = selectedResource === ResourceType.instance;
  const tabsList =
    ResourceType.instance === selectedResource
      ? instancesInfo.filter(
          (instance) => instance.category === ResourceType.instance,
        )
      : [];

  const onCreateRancher = () => {
    console.log({ quantity, technicalModel, selectedResource, planName });
  };

  const isButtonActive =
    quantity > 0 && technicalModel && selectedResource && isLegalChecked;

  const technicalInfoList = instancesInfo.filter(
    (item: InstanceInfo) => item.technicalName === instanceCategory,
  );
  const currentInstanceSelected = technicalInfoList[0];

  // Change Between Instance And Rancher we reset the selectedModel
  const onChangeResource = (value: ResourceType) => {
    setSelectedResource(value);
    if (value === ResourceType.instance) {
      setInstanceCategory(instancesInfo[0].technicalName);
    } else {
      setInstanceCategory(InstanceTechnicalName.rancher);
    }
  };

  const activeInstance = currentInstanceSelected.technical?.find(
    (item) => item.name === technicalModel,
  );

  return (
    <div>
      <Block>
        <Subtitle>{t('choose_ressource')}</Subtitle>
        <DescriptionWrapper>
          {t('choose_ressource_description')}
        </DescriptionWrapper>
        <div className="flex flex-row  w-full">
          {resources.map((resource) => (
            <SimpleTile
              key={resource.value.toString()}
              isActive={selectedResource === resource.value}
              onClick={() => onChangeResource(resource.value)}
            >
              <img className="w-32 h-20" src={resource.img} alt="" />
              <Description>{resource.label}</Description>
            </SimpleTile>
          ))}
        </div>
      </Block>
      <Block>
        <Subtitle>{t('select_model')}</Subtitle>
        {isInstance && (
          <div className="my-4">
            <OsdsTabs panel={instanceCategory}>
              <OsdsTabBar slot="top">
                {tabsList.map((tab) => (
                  <OsdsTabBarItem
                    key={`osds-tab-bar-item-${tab.technicalName}`}
                    panel={tab.technicalName}
                    onClick={() => setInstanceCategory(tab.technicalName)}
                  >
                    {tab.label}
                  </OsdsTabBarItem>
                ))}
              </OsdsTabBar>
            </OsdsTabs>
          </div>
        )}
        <DescriptionWrapper>
          {t(getDescriptionInstanceKey(instanceCategory))}
        </DescriptionWrapper>
        {!isTechnicalInfoLoading ? (
          <div className="flex flex-row">
            {currentInstanceSelected.technical?.map((item) => (
              <TileTechnicalInfo
                technical={item.technical}
                onClick={() => setTechnicalModel(item.name)}
                isActive={technicalModel === item.name}
              />
            ))}
          </div>
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        )}
      </Block>
      <Block>
        <Subtitle>{t('select_quantity')}</Subtitle>
        <DescriptionWrapper>
          {t('select_quantity_description')}
        </DescriptionWrapper>
        <OsdsTile
          rounded
          inline
          variant={ODS_TILE_VARIANT.stroked}
          className="flex flex-row items-center mr-5 text-center justify-between w-full"
        >
          <span slot="start">
            <OsdsText>{t('quantity_label')}</OsdsText>
          </span>
          <span slot="end">
            <QuantitySelector
              quantity={quantity}
              onMinusClick={() => setQuantity(quantity - 1)}
              onPlusClick={() => setQuantity(quantity + 1)}
            />
          </span>
        </OsdsTile>
        <ActionBanner
          message={t('quantity_banner')}
          cta="En savoir plus"
          onClick={() => {}}
        />
      </Block>
      <Block>
        <Subtitle>{t('select_commitment')}</Subtitle>
        <Description>{t('select_commitment_description')}</Description>
        {!isPricingLoading ? (
          pricingByDuration.map((pricing) => {
            return (
              <Commitment
                duration={pricing.duration}
                price={pricing.price.toString()}
                hourlyPriceWithoutCommitment={activeInstance?.hourlyPrice || 0}
              />
            );
          })
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        )}
      </Block>
      <Block>
        <Subtitle>{t('choose_name')}</Subtitle>
        <OsdsInput
          placeholder={t('savings_plan_name_input_placeholder')}
          aria-label="rancher-name-input"
          type={ODS_INPUT_TYPE.text}
          color={
            isValidName(planName)
              ? ODS_THEME_COLOR_INTENT.primary
              : ODS_THEME_COLOR_INTENT.error
          }
          className="my-3 w-1/3"
          value={planName}
          onOdsValueChange={(
            e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
          ) => setPlanName(e.target.value as string)}
        />
        <Description>{t('input_name_rules')}</Description>
      </Block>
      <Block>
        <OsdsCheckbox>
          <OsdsCheckboxButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            interactive={true}
            checked={isLegalChecked}
            onClick={() => setIsLegalChecked(!isLegalChecked)}
            hasFocus={true}
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              slot="end"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {t('legal_checkbox')}
            </OsdsText>
          </OsdsCheckboxButton>
        </OsdsCheckbox>
        <Links
          label="Eula microsoft"
          href="https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/93af107-EULA_MCSFT_VPS_PCI-ALL-1.0.pdf"
          type={LinkType.external}
        />
        <Links
          label="Conditions générales de service"
          href="https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/93af107-EULA_MCSFT_VPS_PCI-ALL-1.0.pdf"
          type={LinkType.external}
        />
        <Links
          label="Data protection agreement"
          href="https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/7ce0301-OVH_Data_Protection_Agreement-FR-6.2.pdf"
          type={LinkType.external}
        />
        <Links
          label="Conditions particulieres"
          href="https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/32ba308-Conditions_particulieres_OVH_Stack-FR-15.0.pdf"
          type={LinkType.external}
        />
      </Block>
      <div className="flex mt-8">
        <OsdsButton
          className="mr-4"
          slot="actions"
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => navigate('..')}
        >
          {t('cta_cancel')}
        </OsdsButton>
        <OsdsButton
          disabled={!isButtonActive}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onCreateRancher}
        >
          {t('cta_plan')}
        </OsdsButton>
      </div>
    </div>
  );
};

const DEFAULT_PRODUCT_CODE = 'b3-8';

export const CreatePlanFormContainer = () => {
  const { t } = useTranslation('create');

  const [instanceCategory, setInstanceCategory] = useState<
    InstanceTechnicalName
  >(InstanceTechnicalName.b3);
  const [technicalModel, setTechnicalModel] = useState<string>(
    DEFAULT_PRODUCT_CODE,
  );

  const {
    data: technicalList,
    isLoading: isTechnicalInfoLoading,
  } = useTechnicalInfo({
    productCode: instanceCategory,
  });
  const {
    data: pricingByDuration,
    isLoading: isPricingLoading,
  } = usePricingInfo({
    productSizeCode: technicalModel,
  });

  const resources: Resource[] = [
    {
      value: ResourceType.instance,
      label: t('resource_tabs_instance'),
      img: serviceSrc,
    },
    {
      value: ResourceType.rancher,
      label: t('resource_tabs_rancher'),
      img: rancherSrc,
    },
  ];

  const instancesInfo = [
    {
      id: '1',
      category: ResourceType.instance,
      technicalName: InstanceTechnicalName.b3,
      label: t('resource_tabs_general_purpose'),
      technical: technicalList,
    },
    {
      id: '2',
      category: ResourceType.instance,
      technicalName: InstanceTechnicalName.c3,
      label: t('resource_tabs_cpu'),
      technical: technicalList,
    },
    {
      id: '3',
      category: ResourceType.instance,
      technicalName: InstanceTechnicalName.r3,
      label: t('resource_tabs_ram'),
      technical: technicalList,
    },
    {
      id: '4',
      category: ResourceType.rancher,
      technicalName: InstanceTechnicalName.rancher,
      label: t('resource_tabs_rancher'),
      technical: technicalList,
    },
  ];

  console.log({ instancesInfo });

  return (
    <CreatePlanForm
      instancesInfo={instancesInfo}
      resources={resources}
      instanceCategory={instanceCategory}
      setInstanceCategory={setInstanceCategory}
      pricingByDuration={pricingByDuration}
      isTechnicalInfoLoading={isTechnicalInfoLoading}
      isPricingLoading={isPricingLoading}
      setTechnicalModel={setTechnicalModel}
      technicalModel={technicalModel}
    />
  );
};

export default CreatePlanForm;
