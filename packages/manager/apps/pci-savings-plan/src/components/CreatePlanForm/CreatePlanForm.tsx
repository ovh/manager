import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { Description, Subtitle } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
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
  OsdsLink,
  OsdsMessage,
  OsdsSpinner,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsText,
  OsdsTile,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import React, { FC, useEffect, useMemo, useState, Suspense } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MutationStatus, useMutationState } from '@tanstack/react-query';

import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import useTechnicalInfo, { usePricingInfo } from '@/hooks/useCatalogCommercial';
import {
  getMutationKeyCreateSavingsPlan,
  useSavingsPlanCreate,
  useServiceId,
} from '@/hooks/useSavingsPlan';
import rancherSrc from '../../assets/images/rancher.png';
import serviceSrc from '../../assets/images/service.png';
import {
  InstanceInfo,
  InstanceTechnicalName,
  Resource,
  ResourceType,
} from '../../types/CreatePlan.type';
import { formatDate } from '../../utils/formatter/date';
import { isValidSavingsPlanName } from '../../utils/savingsPlan';
import Commitment from '../Commitment/Commitment';
import LegalLinks from '../LegalLinks/LegalLinks';
import SimpleTile from '../SimpleTile/SimpleTile';
import { TileTechnicalInfo } from '../TileTechnicalInfo/TileTechnicalInfo';
import {
  PricingByDurationType,
  useDefaultOfferId,
} from '../../hooks/planCreation/useDefaultOffer';

const COMMON_SPACING = 'my-4';

export const DescriptionWrapper: React.FC<{
  children: string;
}> = ({ children }) => {
  return (
    <div className={COMMON_SPACING}>
      <Description>{children}</Description>
    </div>
  );
};

const Block: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="my-8">{children}</div>;
};

export type CreatePlanFormProps = {
  instancesInfo: InstanceInfo[];
  resources: Resource[];
  instanceCategory: InstanceTechnicalName;
  setInstanceCategory: (category: InstanceTechnicalName) => void;
  pricingByDuration: PricingByDurationType[];
  isPricingLoading: boolean;
  isTechnicalInfoLoading: boolean;
  technicalModel: string;
  setTechnicalModel: (technicalModel: string) => void;
  onCreatePlan: ({
    offerId,
    displayName,
    size,
  }: {
    offerId: string;
    displayName: string;
    size: number;
  }) => void;
  isDiscoveryProject: boolean;
};

export const getDescriptionInstanceKey = (resource: string) => {
  return `select_model_description_instance_${resource}`;
};

const buildDisplayName = (instanceDisplayName: string) =>
  `Savings-Plan-${instanceDisplayName}-${formatDate(new Date())}`;

const getInstanceDisplayName = (
  instanceTechnicalName: InstanceTechnicalName,
) => {
  switch (instanceTechnicalName) {
    case InstanceTechnicalName.c3:
      return 'CPU';
    case InstanceTechnicalName.r3:
      return 'RAM';
    case InstanceTechnicalName.rancher:
      return 'RANCHER';
    case InstanceTechnicalName.b3:
    default:
      return 'GP';
  }
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
  onCreatePlan,
  isDiscoveryProject,
}: CreatePlanFormProps) => {
  const pciUrl = usePciUrl();
  const navigate = useNavigate();
  const { t } = useTranslation('create');
  const [selectedResource, setSelectedResource] = useState<ResourceType>(
    ResourceType.instance,
  );
  const DEFAULT_NAME = buildDisplayName(
    getInstanceDisplayName(instanceCategory),
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [planName, setPlanName] = useState<string>(DEFAULT_NAME);
  const [offerIdSelected, setOfferIdSelected] = useDefaultOfferId(
    pricingByDuration,
  );
  const [isLegalChecked, setIsLegalChecked] = useState<boolean>(false);

  const serviceId = useServiceId();

  const mutationSPCreate = useMutationState<{
    status: MutationStatus;
    variables: {
      periodEndAction: 'REACTIVATE' | 'ACTIVATE';
    };
    error?: {
      response: {
        statusText: string;
      };
    };
  }>({
    filters: { mutationKey: getMutationKeyCreateSavingsPlan(serviceId) },
  });

  const hasCreationErrorMessage =
    mutationSPCreate[0]?.error?.response?.statusText;

  useEffect(() => {
    if (hasCreationErrorMessage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [hasCreationErrorMessage]);

  const isInstance = selectedResource === ResourceType.instance;
  const tabsList = isInstance
    ? instancesInfo.filter(
        (instance) => instance.category === ResourceType.instance,
      )
    : [];

  const isButtonActive = useMemo(
    () =>
      quantity > 0 &&
      offerIdSelected &&
      technicalModel &&
      selectedResource &&
      isLegalChecked &&
      planName &&
      !isDiscoveryProject,
    [
      quantity,
      offerIdSelected,
      technicalModel,
      selectedResource,
      isLegalChecked,
      planName,
      isDiscoveryProject,
    ],
  );

  const technicalInfoList = instancesInfo.filter(
    (item: InstanceInfo) => item.technicalName === instanceCategory,
  );
  const [currentInstanceSelected] = technicalInfoList;
  const activeInstance = currentInstanceSelected.technical?.find(
    (item) => item.name === technicalModel,
  );

  useEffect(() => {
    if (instanceCategory) {
      setPlanName(buildDisplayName(getInstanceDisplayName(instanceCategory)));
    }
  }, [instanceCategory]);

  // Change Between Instance And Rancher we reset the selectedModel
  const onChangeResource = (value: ResourceType) => {
    setSelectedResource(value);
    if (value === ResourceType.instance) {
      setInstanceCategory(instancesInfo[0].technicalName);
    } else {
      setInstanceCategory(InstanceTechnicalName.rancher);
    }
  };

  const onSelectModel = (model: string) => {
    setTechnicalModel(model);
    setOfferIdSelected(undefined);
  };

  const onCreateSavingsPlan = () => {
    if (offerIdSelected) {
      onCreatePlan({
        offerId: offerIdSelected,
        displayName: planName,
        size: quantity,
      });
    }
  };

  const onChangeQuantity = (v: number) => setQuantity(v);

  return (
    <div>
      <Block>
        {hasCreationErrorMessage && (
          <OsdsMessage type={ODS_MESSAGE_TYPE.error} className="my-4">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              className="inline-block"
            >
              Une erreur est survenue lors de la création : &nbsp;
              {hasCreationErrorMessage}
            </OsdsText>
          </OsdsMessage>
        )}
        <Subtitle>{t('choose_ressource')}</Subtitle>
        <DescriptionWrapper>
          {t('choose_ressource_description')}
        </DescriptionWrapper>
        <div className="flex flex-row  w-full overflow-x-auto">
          {resources.map((resource) => (
            <SimpleTile
              key={resource.value.toString()}
              isActive={selectedResource === resource.value}
              onClick={() => onChangeResource(resource.value)}
            >
              <img className="w-16 h-16" src={resource.img} alt="" />
              <Description>{resource.label}</Description>
            </SimpleTile>
          ))}
        </div>
      </Block>
      <Block>
        <Subtitle>{t('select_model')}</Subtitle>
        {isInstance && (
          <div className={COMMON_SPACING}>
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
          <div className="flex flex-row w-full overflow-x-auto">
            {currentInstanceSelected.technical?.map(({ name, technical }) => (
              <TileTechnicalInfo
                key={name}
                technical={technical}
                name={name}
                onClick={() => onSelectModel(name)}
                isActive={technicalModel === name}
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
              onChangeQuantity={onChangeQuantity}
            />
          </span>
        </OsdsTile>
        <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="my-4">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            className="inline-block"
          >
            {t(
              isInstance
                ? 'quantity_banner_instance'
                : 'quantity_banner_rancher',
            )}
            {isInstance && (
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.primary}
                href={`${pciUrl}/quota`}
                target={OdsHTMLAnchorElementTarget._blank}
              >
                {t('quantity_banner_instance_link')}
                <OsdsIcon
                  className="ml-2"
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsLink>
            )}
          </OsdsText>
        </OsdsMessage>
      </Block>
      <Block>
        <Subtitle>{t('select_commitment')}</Subtitle>
        <DescriptionWrapper>
          {t('select_commitment_description')}
        </DescriptionWrapper>
        <Suspense>
          {!isPricingLoading && !isTechnicalInfoLoading ? (
            pricingByDuration?.map((pricing) => {
              return (
                <Commitment
                  key={pricing.id}
                  onClick={() => setOfferIdSelected(pricing.id)}
                  isActive={offerIdSelected === pricing.id}
                  duration={pricing.duration}
                  price={pricing.price?.toString()}
                  quantity={quantity}
                  hourlyPriceWithoutCommitment={
                    activeInstance?.hourlyPrice || 0
                  }
                />
              );
            })
          ) : (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          )}
        </Suspense>
      </Block>
      <Block>
        <Subtitle>{t('choose_name')}</Subtitle>
        <OsdsInput
          placeholder={t('savings_plan_name_input_placeholder')}
          aria-label="savings-plan-name-input"
          type={ODS_INPUT_TYPE.text}
          color={
            isValidSavingsPlanName(planName)
              ? ODS_THEME_COLOR_INTENT.primary
              : ODS_THEME_COLOR_INTENT.error
          }
          className={`${COMMON_SPACING} md:w-1/3`}
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
        <LegalLinks />
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
          disabled={!isButtonActive || undefined}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={onCreateSavingsPlan}
        >
          {t('cta_plan')}
        </OsdsButton>
      </div>
    </div>
  );
};

const DEFAULT_PRODUCT_CODE = 'b3-8';

export const CreatePlanFormContainer = ({
  isDiscoveryProject,
}: {
  isDiscoveryProject: boolean;
}) => {
  const { t } = useTranslation('create');

  const [instanceCategory, setInstanceCategory] = useState<
    InstanceTechnicalName
  >(InstanceTechnicalName.b3);
  const [technicalModel, setTechnicalModel] = useState<string>(
    DEFAULT_PRODUCT_CODE,
  );

  const {
    data: technicalList = [],
    isLoading: isTechnicalInfoLoading,
  } = useTechnicalInfo({
    productCode: instanceCategory,
  });

  const {
    data: pricingByDuration = [],
    isLoading: isPricingLoading,
  } = usePricingInfo({
    productSizeCode: technicalModel,
  });

  useEffect(() => {
    if (technicalList.length > 0) {
      setTechnicalModel(technicalList[0].name);
    }
  }, [technicalList]);

  const { mutate: onCreatePlan } = useSavingsPlanCreate();

  const sortedPriceByDuration = [...pricingByDuration].sort(
    (a, b) => a.duration - b.duration,
  );

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

  const instancesInfo: InstanceInfo[] = [
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

  return (
    <CreatePlanForm
      onCreatePlan={onCreatePlan}
      resources={resources}
      instancesInfo={instancesInfo}
      instanceCategory={instanceCategory}
      setInstanceCategory={setInstanceCategory}
      pricingByDuration={sortedPriceByDuration}
      isTechnicalInfoLoading={isTechnicalInfoLoading}
      isPricingLoading={isPricingLoading}
      setTechnicalModel={setTechnicalModel}
      technicalModel={technicalModel}
      isDiscoveryProject={isDiscoveryProject}
    />
  );
};

export default CreatePlanForm;
