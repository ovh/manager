import { Subtitle, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  OdsInputChangeEvent,
} from '@ovhcloud/ods-components';

import {
  OdsButton,
  OdsInput,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, {
  FC,
  PropsWithChildren,
  Suspense,
  startTransition,
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
  ShellContext,
  useOvhTracking,
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
  TPricingByDuration,
  useDefaultOfferId,
} from '../../hooks/planCreation/useDefaultOffer';
import {
  InstanceInfo,
  InstanceTechnicalName,
  Resource,
  ResourceType,
  TechnicalInfo,
} from '@/types/CreatePlan.type';
import CommitmentWrapper from '../Commitment/CommitmentWrapper';
import SelectDeployment from './SelectDeployment';
import SelectModel from './SelectModel';
import SelectQuantity, {
  DEFAULT_QUANTITY,
  MAX_QUANTITY,
} from './SelectQuantity';
import { toLocalDateUTC } from '../../utils/formatter/date';
import {
  buildDisplayName,
  DeploymentMode,
  getInstanceDisplayName,
  getInstancesInformation,
  isValidSavingsPlanName,
} from '../../utils/savingsPlan';
import SelectResource from './SelectResource';
import CreatePlanConfirmModal from './CreatePlanConfirmModal';
import { usePlanPricing } from '@/hooks/planCreation/usePlanPricing';

const COMMON_SPACING = 'my-4';

export const DescriptionWrapper: React.FC<PropsWithChildren<{
  className?: string;
}>> = ({ children, className }) => {
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
  technical: TechnicalInfo[];
};

export type CreatePlanFormProps = {
  instancesInfo: InstanceInfoWithTechnical[];
  resources: Resource[];
  instanceCategory: InstanceTechnicalName;
  setInstanceCategory: (category: InstanceTechnicalName) => void;
  pricingByDuration: TPricingByDuration[];
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
  setDeploymentMode: (deploymentMode: DeploymentMode) => void;
  deploymentMode: DeploymentMode;
  isCreatePlanPending: boolean;
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
  setDeploymentMode,
  deploymentMode,
  isCreatePlanPending,
}: CreatePlanFormProps) => {
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [offerIdSelected, setOfferIdSelected] = useDefaultOfferId(
    pricingByDuration,
  );

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
      planName &&
      !isDiscoveryProject &&
      isValidPlanName &&
      !isCreatePlanPending,
    [
      quantity,
      offerIdSelected,
      technicalModel,
      selectedResource,
      planName,
      isDiscoveryProject,
      isValidPlanName,
      isCreatePlanPending,
    ],
  );

  const technicalInfoList = instancesInfo.filter(
    (item: InstanceInfo) => item.technicalName === instanceCategory,
  );
  const [instanceSelected] = technicalInfoList;

  const activeInstance = instanceSelected.technical?.find(
    (item) => item.name === technicalModel,
  );

  const onSetInstanceCategory = useCallback(
    (category: InstanceTechnicalName) => {
      setInstanceCategory(category);
      setPlanName(buildDisplayName(getInstanceDisplayName(category)));
    },
    [setInstanceCategory, setPlanName],
  );

  // Change Between Instance And Rancher we reset the selectedModel
  const onChangeResource = (value: ResourceType) => {
    setSelectedResource(value);
    setDeploymentMode(DeploymentMode['1AZ']);
    if (value === ResourceType.instance) {
      onSetInstanceCategory(instancesInfo[0].technicalName);
    } else {
      onSetInstanceCategory(InstanceTechnicalName.rancher);
    }
  };

  const onSelectModel = (model: string) => {
    setTechnicalModel(model);
    setOfferIdSelected(undefined);
  };

  const selectedDuration = useMemo(
    () =>
      offerIdSelected &&
      pricingByDuration?.find((price) => price.id === offerIdSelected)
        ?.duration,
    [pricingByDuration, offerIdSelected],
  );
  const selectedOs = activeInstance?.technical?.os?.family;

  const enrichedPricingByDuration = usePlanPricing({
    pricingByDuration,
    quantity,
    activeHourlyPrice: activeInstance?.hourlyPrice || 0,
  });

  const onCreateSavingsPlan = () => {
    setIsModalOpen(false);
    if (offerIdSelected) {
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: [
          `add_savings_plan`,
          `confirm`,
          `savings_plan_created_${selectedDuration}M_${selectedOs}_${technicalModel}_${quantity}_${deploymentMode}`,
        ],
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
      if (newValue >= DEFAULT_QUANTITY && newValue <= MAX_QUANTITY) {
        setQuantity(newValue);
      } else {
        setQuantity(DEFAULT_QUANTITY);
      }
    },
    [setQuantity],
  );

  const currentPlanPricing = enrichedPricingByDuration.find(
    (planPricing) => planPricing.id === offerIdSelected,
  );
  return (
    <div>
      {currentPlanPricing && (
        <CreatePlanConfirmModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onCreateSavingsPlan={onCreateSavingsPlan}
          savingsPlanInfo={{
            name: planName,
            duration: selectedDuration,
            resource: selectedResource,
            deploymentMode,
            model: technicalModel,
            quantity,
            monthlyPrice: currentPlanPricing.monthlyPrice,
            monthlyPercentageDiscount:
              currentPlanPricing.monthlyPercentageDiscount,
            monthlyPriceWithoutDiscount:
              currentPlanPricing.monthlyPriceWithoutDiscount,
          }}
        />
      )}
      <SelectResource
        resources={resources}
        selectedResource={selectedResource}
        onChangeResource={onChangeResource}
        hasCreationErrorMessage={hasCreationErrorMessage}
      />
      {isInstance && (
        <SelectDeployment
          setDeploymentMode={setDeploymentMode}
          deploymentMode={deploymentMode}
        />
      )}
      <SelectModel
        technicalInfo={instanceSelected.technical}
        isInstance={isInstance}
        tabsList={tabsList}
        instanceCategory={instanceCategory}
        setInstanceCategory={onSetInstanceCategory}
        isTechnicalInfoLoading={isTechnicalInfoLoading}
        technicalModel={technicalModel}
        onSelectModel={onSelectModel}
      />
      <SelectQuantity
        isInstance={isInstance}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
      />
      <CommitmentWrapper
        enrichedPricingByDuration={enrichedPricingByDuration}
        isLoading={isPricingLoading || isTechnicalInfoLoading}
        setOfferIdSelected={setOfferIdSelected}
        offerIdSelected={offerIdSelected}
      />
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

      <div className="flex mt-[40px]">
        <OdsButton
          data-testid="cta-cancel-button"
          label={t('cta_cancel')}
          className="mr-4"
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            navigate('..');
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [
                `add_savings_plan`,
                `cancel_${selectedDuration}M_${selectedOs}_${technicalModel}_${quantity}_${deploymentMode}`,
              ],
            });
          }}
        />
        <OdsButton
          data-testid="cta-plan-button"
          label={t('cta_plan')}
          isDisabled={!isButtonActive}
          onClick={() => setIsModalOpen(true)}
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
  const [deploymentMode, setDeploymentMode] = useState<DeploymentMode>(
    DeploymentMode['1AZ'],
  );

  const {
    data: technicalList = [],
    isLoading: isTechnicalInfoLoading,
  } = useTechnicalInfo({
    productCode: instanceCategory,
    deploymentMode,
  });

  const computedTechnicalModel =
    deploymentMode === DeploymentMode['1AZ']
      ? technicalModel
      : `${technicalModel} ${deploymentMode}`;

  const {
    data: pricingByDuration = [],
    isLoading: isPricingLoading,
  } = usePricingInfo({
    productSizeCode: computedTechnicalModel,
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

  const {
    mutate: onCreatePlan,
    isPending: isCreatePlanPending,
  } = useSavingsPlanCreate(handleCreateSavingsPlanSuccess);

  const sortedPriceByDuration = [...pricingByDuration].sort(
    (a, b) => (a.duration ?? 0) - (b.duration ?? 0),
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
    <Suspense fallback={<OdsSpinner />}>
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
        setDeploymentMode={setDeploymentMode}
        deploymentMode={deploymentMode}
        isCreatePlanPending={isCreatePlanPending}
      />
    </Suspense>
  );
};

export default CreatePlanForm;
