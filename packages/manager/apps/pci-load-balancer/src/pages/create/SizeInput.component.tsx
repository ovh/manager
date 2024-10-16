import {
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TAddon } from '@/pages/create/store';

const LabelComponent = ({
  item,
  isSelected,
}: Readonly<{
  item: TAddon;
  isSelected: boolean;
}>) => {
  const { t: tCreate } = useTranslation('load-balancer/create');

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
  addons,
  value = null,
  onInput,
}: Readonly<{
  addons: TAddon[];
  value?: TAddon;
  onInput: (item: TAddon) => void;
}>): JSX.Element {
  return (
    <TilesInputComponent<TAddon>
      items={addons}
      value={value}
      onInput={onInput}
      label={(item) => (
        <LabelComponent item={item} isSelected={value?.code === item?.code} />
      )}
      tileClass={{ active: 'h-full', inactive: 'h-full' }}
    />
  );
}
