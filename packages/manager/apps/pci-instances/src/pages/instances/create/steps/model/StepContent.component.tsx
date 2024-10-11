import { Notifications, TabsComponent } from '@ovh-ux/manager-react-components';
import { OsdsDivider } from '@ovhcloud/ods-components/react';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@/components/spinner/Spinner.component';
import {
  TModelCategory,
  TModelEntity,
  TModelPricing,
  TPriceInterval,
} from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { TabTitle } from '@/components/tab/TabTitle.component';
import { TabContent } from './TabContent.component';

type TStepContentProps = {
  data?: TModelEntity;
  isStepLoading: boolean;
  isNotificationOpen: boolean;
  getModelPriceByInterval: (
    pricings: DeepReadonly<TModelPricing[]>,
    key: TPriceInterval,
  ) => number | undefined;
};

export const StepContent: FC<TStepContentProps> = ({
  data,
  isStepLoading,
  isNotificationOpen,
  getModelPriceByInterval,
}) => {
  const { t } = useTranslation('models');

  const tabTitle = useCallback(
    (category: DeepReadonly<TModelCategory>, isSelected?: boolean) => (
      <TabTitle
        isSelected={!!isSelected}
        label={t(`pci_instances_models_category_${category.name}_title`)}
        isNew={category.isNew}
      />
    ),
    [t],
  );

  const tabContent = useCallback(
    (category: DeepReadonly<TModelCategory>) => (
      <TabContent
        category={category}
        data={data}
        getModelPriceByInterval={getModelPriceByInterval}
      />
    ),
    [data, getModelPriceByInterval],
  );
  return (
    <>
      {isStepLoading && <Spinner />}
      {isNotificationOpen && (
        <>
          <OsdsDivider />
          <Notifications />
          <OsdsDivider />
        </>
      )}
      {data && (
        <TabsComponent<DeepReadonly<TModelCategory>>
          items={data.models.categories as TModelCategory[]}
          itemKey={({ name }) => name}
          titleElement={tabTitle}
          contentElement={tabContent}
        />
      )}
    </>
  );
};
