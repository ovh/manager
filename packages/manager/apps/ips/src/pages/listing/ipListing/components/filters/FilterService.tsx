import React, { startTransition, useContext } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
} from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';
import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import { useGetProductServices } from '@/data/hooks/useGetProductServices';
import { ListingContext } from '@/pages/listing/listingContext';

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
  const [filterValueLabel, setFilterValueLabel] = React.useState<string>('');
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
    [t],
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
    <Combobox
      className={`h-min ${className}`}
      name="filter-service"
      allowCustomValue={false}
      value={[filterValueLabel]}
      customOptionRenderer={ComboboxServiceItem}
      highlightResults
      onValueChange={(e) => {
        const value = e.value?.[0];

        if (value) {
          trackClick({
            buttonType: ButtonType.select,
            location: PageLocation.page,
            actionType: 'action',
            actions: [`filter_${value}`],
          });
        }

        setFilterValueLabel(value || '');

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
      items={[
        {
          label: t(`listingColumnsType_${IpTypeEnum.ADDITIONAL}`),
          options: [
            {
              label: t(getAllItemLabelKeyFromType(IpTypeEnum.ADDITIONAL)),
              value: t(getAllItemLabelKeyFromType(IpTypeEnum.ADDITIONAL)),
            },
          ],
        },
        ...Object.values(PRODUCT_PATHS_AND_CATEGORIES)
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
          .map(({ category }) => ({
            label: t(`listingColumnsType_${category}`),
            options: [
              {
                label: t(getAllItemLabelKeyFromType(category)),
                value: t(getAllItemLabelKeyFromType(category)),
              },
              ...serviceByCategory?.[category]?.map(
                ({ serviceName, displayName }) => ({
                  label:
                    displayName && displayName !== serviceName
                      ? `${displayName} (${serviceName})`
                      : serviceName,
                  value: serviceName,
                }),
              ),
            ],
          })),
      ]}
    >
      <ComboboxControl clearable placeholder={t('listingFilterTypeAllTypes')} />
      <ComboboxContent />
    </Combobox>
  );
};
