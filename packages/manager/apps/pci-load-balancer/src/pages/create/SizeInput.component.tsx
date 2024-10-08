import { useCatalog } from '@ovh-ux/manager-pci-common';
import {
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const SIZE_FLAVOUR_REGEX = /octavia-loadbalancer.loadbalancer-([sml]).hour.consumption/;

export type TPlan = {
  code: string;
  price: number;
  label: string;
  technicalName: string;
};

const LabelComponent = ({
  item,
  isSelected,
}: Readonly<{
  item: TPlan;
  isSelected: boolean;
}>) => {
  const { t: tCreate } = useTranslation('create');

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice();

  return (
    <div className="w-full">
      <div>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
          className={isSelected ? 'font-bold' : ''}
        >
          {tCreate('octavia_load_balancer_create_size_flavour_title', {
            sizeCode: item.label,
          })}
        </OsdsText>
        <div className="mt-4">
          <OsdsText
            size={ODS_TEXT_SIZE._300}
            level={ODS_TEXT_LEVEL.button}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate(
              `octavia_load_balancer_create_size_flavour_description_${item.code}`,
            )}
          </OsdsText>
        </div>
        <div className="mt-4 pt-4 text-center border-solid border-t border-0 border-[--ods-color-blue-200]">
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {getFormattedHourlyCatalogPrice(item.price)}
          </OsdsText>
        </div>
      </div>
    </div>
  );
};

export default function SizeInputComponent({
  value = null,
  onInput,
}: Readonly<{ value?: TPlan; onInput: (item: TPlan) => void }>): JSX.Element {
  const { data: catalog, isPending: isCatalogPending } = useCatalog();

  const plans = (catalog?.addons
    ? catalog.addons.reduce((filtered: TPlan[], addon) => {
        const found = addon.planCode.match(SIZE_FLAVOUR_REGEX);
        if (found) {
          filtered.push({
            code: found[1],
            price: addon.pricings[0].price,
            label: found[1].toUpperCase(),
            technicalName: addon.blobs.technical.name,
          });
        }
        return filtered;
      }, [])
    : []
  ).sort((a, b) => a.price - b.price);

  return (
    <TilesInputComponent<TPlan>
      items={plans}
      value={value}
      onInput={onInput}
      label={(item) => (
        <LabelComponent item={item} isSelected={value?.code === item?.code} />
      )}
      tileClass={{ active: 'h-full', inactive: 'h-full' }}
    />
  );
}
