import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  OdsInputChangeEvent,
} from '@ovhcloud/ods-components';

import {
  OdsButton,
  OdsCard,
  OdsCheckbox,
  OdsInput,
  OdsLink,
  OdsMessage,
  OdsQuantity,
  OdsSpinner,
  OdsTab,
  OdsTabs,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, {
  FC,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MutationStatus, useMutationState } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import clsx from 'clsx';
import useTechnicalInfo, { usePricingInfo } from '@/hooks/useCatalogCommercial';
import {
  getMutationKeyCreateSavingsPlan,
  useSavingsPlanCreate,
  useServiceId,
} from '@/hooks/useSavingsPlan';
import rancherSrc from '../../assets/images/rancher.png';
import serviceSrc from '../../assets/images/service.png';
import {
  PricingByDurationType,
  useDefaultOfferId,
} from '../../hooks/planCreation/useDefaultOffer';
import {
  InstanceInfo,
  InstanceTechnicalName,
  Resource,
  ResourceType,
} from '../../types/CreatePlan.type';
import { formatDate, toLocalDateUTC } from '../../utils/formatter/date';
import {
  getInstancesInformation,
  isValidSavingsPlanName,
} from '../../utils/savingsPlan';
import Commitment from '../Commitment/Commitment';
import SimpleTile from '../SimpleTile/SimpleTile';
import { TileTechnicalInfo } from '../TileTechnicalInfo/TileTechnicalInfo';
import LegalLinks from '../LegalLinks/LegalLinks';
import { formatTechnicalInfo } from '@/utils/formatter/formatter';

const COMMON_SPACING = 'my-4';

export const DescriptionWrapper: React.FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={clsx(COMMON_SPACING, className)}>
      <OdsText>{children}</OdsText>
    </div>
  );
};

const Block: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="my-8">{children}</div>;
};

type InstanceInfoWithTechnical = InstanceInfo & {
  technical: ReturnType<typeof formatTechnicalInfo>[];
};

export type CreatePlanFormProps = {
  instancesInfo: InstanceInfoWithTechnical[];
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
  const { trackClick } = useOvhTracking();
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

  const isValidPlanName = isValidSavingsPlanName(planName);

  const isButtonActive = useMemo(
    () =>
      quantity > 0 &&
      offerIdSelected &&
      technicalModel &&
      selectedResource &&
      isLegalChecked &&
      planName &&
      !isDiscoveryProject &&
      isValidPlanName,
    [
      quantity,
      offerIdSelected,
      technicalModel,
      selectedResource,
      isLegalChecked,
      planName,
      isDiscoveryProject,
      isValidPlanName,
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
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: [`add_savings_plan::cancell`],
      });
      onCreatePlan({
        offerId: offerIdSelected,
        displayName: planName,
        size: quantity,
      });
    }
  };

  const handleQuantityChange = useCallback(
    (event: OdsInputChangeEvent) => {
      const newValue = Number(event.detail.value);
      if (newValue >= 1 && newValue <= 1000) {
        setQuantity(newValue);
      } else {
        setQuantity(1);
      }
    },
    [setQuantity],
  );

  return (
    <div>
      <Block>
        {hasCreationErrorMessage && (
          <OdsMessage color="danger" className="my-4">
            <OdsText className="inline-block">
              Une erreur est survenue lors de la création : &nbsp;
              {hasCreationErrorMessage}
            </OdsText>
          </OdsMessage>
        )}
        <Subtitle>{t('choose_ressource')}</Subtitle>
        <DescriptionWrapper>
          {t('choose_ressource_description')}
        </DescriptionWrapper>
        <div className="flex flex-row  w-full overflow-x-auto">
          {resources.map((resource) => (
            <SimpleTile
              className="py-5"
              key={resource.value.toString()}
              isActive={selectedResource === resource.value}
              onClick={() => onChangeResource(resource.value)}
            >
              <img
                className="w-16 h-16"
                src={resource.img}
                alt={resource.value}
              />
              <div>
                <OdsText>{resource.label}</OdsText>
              </div>
            </SimpleTile>
          ))}
        </div>
      </Block>
      <Block>
        <Subtitle>{t('select_model')}</Subtitle>
        {isInstance && (
          <div className="mb-[16px] mt-[12px]">
            <OdsTabs slot="top">
              {tabsList.map((tab) => (
                <OdsTab
                  key={`Ods-tab-bar-item-${tab.technicalName}`}
                  isSelected={tab.technicalName === instanceCategory}
                  onClick={() => setInstanceCategory(tab.technicalName)}
                >
                  {t(tab.label)}
                </OdsTab>
              ))}
            </OdsTabs>
          </div>
        )}
        <DescriptionWrapper>
          {t(getDescriptionInstanceKey(instanceCategory))}
        </DescriptionWrapper>
        {!isTechnicalInfoLoading ? (
          <div className="flex flex-row w-full overflow-x-auto mb-[32px]">
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
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        )}
      </Block>
      <Block>
        <Subtitle>{t('select_quantity')}</Subtitle>
        <DescriptionWrapper className="mb-[12px]">
          {t('select_quantity_description')}
        </DescriptionWrapper>
        <OdsCard className="flex flex-row items-center mr-5 p-4 text-center justify-between w-full mb-[32px] mt-[16px] border border-[--ods-color-neutral-200]">
          <OdsText>{t('quantity_label')}</OdsText>
          <OdsQuantity
            onOdsChange={handleQuantityChange}
            value={quantity}
            min={1}
            max={1000}
            name="quantity"
          />
        </OdsCard>
        <OdsMessage className="my-4" isDismissible={false}>
          <OdsText className="inline-block">
            {t(
              isInstance
                ? 'quantity_banner_instance'
                : 'quantity_banner_rancher',
            )}
            {isInstance && (
              <OdsLink
                href={`${pciUrl}/quota`}
                target="_blank"
                icon={ODS_ICON_NAME.externalLink}
                label={t('quantity_banner_instance_link')}
              />
            )}
          </OdsText>
        </OdsMessage>
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
            <OdsSpinner size={ODS_SPINNER_SIZE.md} />
          )}
        </Suspense>
      </Block>
      <Block>
        <Subtitle>{t('choose_name')}</Subtitle>
        <OdsInput
          name="savings-plan-name-input"
          placeholder={t('savings_plan_name_input_placeholder')}
          aria-label="savings-plan-name-input"
          type={ODS_INPUT_TYPE.text}
          hasError={!isValidPlanName}
          className={`${COMMON_SPACING} md:w-1/3`}
          value={planName}
          onOdsChange={(e) => setPlanName(e.target.value as string)}
        />
        <div>
          <OdsText>{t('input_name_rules')}</OdsText>
        </div>
      </Block>
      <Block>
        <OdsCheckbox
          inputId="checkbox-label"
          className="mr-4"
          name="legal-checked"
          isChecked={isLegalChecked}
          onClick={() => setIsLegalChecked(!isLegalChecked)}
        />
        <label htmlFor="checkbox-label">
          <OdsText>{t('legal_checkbox')}</OdsText>
        </label>
        <LegalLinks className="mr-[5px]" />
      </Block>
      <div className="flex mt-[40px]">
        <OdsButton
          data-testid="cta-cancel-button"
          label={t('cta_cancel')}
          className="mr-4"
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => navigate('..')}
        />

        <OdsButton
          data-testid="cta-plan-button"
          label={t('cta_plan')}
          isDisabled={!isButtonActive}
          onClick={onCreateSavingsPlan}
        />
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
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();

  const { t } = useTranslation(['create', 'listing']);
  const { addSuccess } = useNotifications();

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

  const handleCreateSavingsPlanSuccess = useCallback(
    (data: { startDate: string }) => {
      addSuccess(
        t('listing:banner_create_sp', {
          startDate: toLocalDateUTC(data.startDate, locale),
        }),
      );
    },
    [addSuccess, t, locale],
  );

  const { mutate: onCreatePlan } = useSavingsPlanCreate(
    handleCreateSavingsPlanSuccess,
  );

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

  const instancesInformation = useMemo(
    () =>
      getInstancesInformation(t).map((i) => ({
        ...i,
        technical: technicalList,
      })),
    [technicalList, t],
  );

  return (
    <CreatePlanForm
      onCreatePlan={onCreatePlan}
      resources={resources}
      instancesInfo={instancesInformation}
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
