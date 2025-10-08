import React, { useContext } from 'react';
import {
  OdsCombobox,
  OdsComboboxGroup,
  OdsComboboxItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
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
    if (apiFilter?.['routedTo.serviceName']) {
      setFilterValueLabel(apiFilter['routedTo.serviceName']);
    }
    if (apiFilter?.type) {
      setFilterValueLabel(t(getAllItemLabelKeyFromType(apiFilter.type)));
    }
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

        setFilterValueLabel(value);

        if (!value) {
          return setApiFilter((prev) => ({
            ...prev,
            type: undefined,
            'routedTo.serviceName': undefined,
          }));
        }

        const newFilter = Object.keys(categoryByTypeLabel).includes(value)
          ? {
              type: categoryByTypeLabel[value],
              'routedTo.serviceName': undefined as string,
            }
          : {
              type: undefined,
              'routedTo.serviceName': value,
            };
        return setApiFilter((prev) => ({
          ...prev,
          ...newFilter,
          // Also reset IP filter when changing service filter
          ip: undefined,
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
