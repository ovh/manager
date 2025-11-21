import React, { startTransition, useContext } from 'react';
import {
  OdsCombobox,
  OdsComboboxGroup,
  OdsComboboxItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import { ListingContext } from '@/pages/listing/listingContext';
import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';
import { useGetProductServices } from '@/data/hooks/useGetProductServices';

const serviceOrder = [
  IpTypeEnum.ADDITIONAL,
  IpTypeEnum.CLOUD,
  IpTypeEnum.DEDICATED,
  IpTypeEnum.LOAD_BALANCING,
  IpTypeEnum.PCC,
  IpTypeEnum.VRACK,
  IpTypeEnum.VPS,
  IpTypeEnum.XDSL,
  IpTypeEnum.OVERTHEBOX,
];

const getAllItemLabelKeyFromType = (type: IpTypeEnum) => `all_items_${type}`;

const productParamList = Object.values(PRODUCT_PATHS_AND_CATEGORIES);

export const FilterService = ({ className }: { className?: string }) => {
  const { t } = useTranslation('listing');
  const { apiFilter, setApiFilter } = useContext(ListingContext);
  const [filterValueLabel, setFilterValueLabel] = React.useState('');
  const { serviceByCategory } = useGetProductServices(productParamList);
  const { trackClick } = useOvhTracking();

  const categoryByTypeLabel = React.useMemo(
    () =>
      productParamList.reduce(
        (acc, { category }) => ({
          ...acc,
          [t(getAllItemLabelKeyFromType(category))]: category,
        }),
        {
          [t(
            getAllItemLabelKeyFromType(IpTypeEnum.ADDITIONAL),
          )]: IpTypeEnum.ADDITIONAL,
        } as Record<string, IpTypeEnum>,
      ),
    [],
  );

  React.useEffect(() => {
    startTransition(() => {
      setFilterValueLabel(() => {
        if (apiFilter?.['routedTo.serviceName'] === null && !apiFilter?.type) {
          return '';
        }
        if (apiFilter?.['routedTo.serviceName']) {
          return apiFilter['routedTo.serviceName'];
        }
        if (apiFilter?.type) {
          return t(getAllItemLabelKeyFromType(apiFilter.type));
        }
        return '';
      });
    });
  }, [apiFilter]);

  return (
    <OdsCombobox
      className={`h-min ${className}`}
      name="filter-service"
      isClearable
      allowNewElement={false}
      placeholder={t('listingFilterTypeAllTypes')}
      value={filterValueLabel}
      onOdsChange={(e) => {
        const { value } = e.detail;

        if (value) {
          trackClick({
            buttonType: ButtonType.select,
            location: PageLocation.page,
            actionType: 'action',
            actions: [`filter_${value}`],
          });
        }

        setFilterValueLabel(value);

        if (!value) {
          return setApiFilter((prev) => {
            const newFilter = { ...prev };
            delete newFilter.type;

            if (newFilter['routedTo.serviceName'] !== null) {
              delete newFilter['routedTo.serviceName'];
            }

            return newFilter;
          });
        }

        return setApiFilter((prev) => ({
          ...prev,
          ...(Object.keys(categoryByTypeLabel).includes(value)
            ? {
                type: categoryByTypeLabel[value],
                ip: undefined,
              }
            : {
                'routedTo.serviceName': value,
                ip: undefined,
              }),
        }));
      }}
    >
      <OdsComboboxGroup>
        <span slot="title">
          {t(`listingColumnsType_${IpTypeEnum.ADDITIONAL}`)}
        </span>
        <OdsComboboxItem
          value={t(getAllItemLabelKeyFromType(IpTypeEnum.ADDITIONAL))}
        >
          {t(getAllItemLabelKeyFromType(IpTypeEnum.ADDITIONAL))}
        </OdsComboboxItem>
      </OdsComboboxGroup>
      {Object.values(PRODUCT_PATHS_AND_CATEGORIES)
        .filter(
          ({ category }) =>
            serviceByCategory?.[category] &&
            serviceByCategory?.[category].length > 0,
        )
        .sort(
          (a, b) =>
            serviceOrder.findIndex((value) => value === a.category) -
            serviceOrder.findIndex((value) => value === b.category),
        )
        .map(({ category }) => (
          <OdsComboboxGroup key={category}>
            <span slot="title">{t(`listingColumnsType_${category}`)}</span>
            <OdsComboboxItem value={t(getAllItemLabelKeyFromType(category))}>
              {t(getAllItemLabelKeyFromType(category))}
            </OdsComboboxItem>
            {serviceByCategory?.[category]?.map(
              ({ serviceName, displayName }) => (
                <ComboboxServiceItem
                  key={serviceName}
                  name={serviceName}
                  displayName={displayName}
                />
              ),
            )}
          </OdsComboboxGroup>
        ))}
    </OdsCombobox>
  );
};
