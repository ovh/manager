import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectCustomItemRendererArg,
  SelectContent,
  SelectCustomOptionRendererArg,
  SelectGroupItem,
  SelectProp,
} from '@ovhcloud/ods-react';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import Localization from './Localization.component';

export type TCustomRegionItemData = {
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  regionId: string;
};

type TLocalizationSelectProps<TCustomData extends TCustomRegionItemData> = Omit<
  SelectProp,
  'items'
> & {
  regions: SelectGroupItem<TCustomData>[];
  className?: string;
};

const continentDividerClassname =
  '[&>div>div>span]:w-full [&>div:not(:last-child)]:border-solid [&>div]:border-x-0 [&>div]:border-t-0 [&>div]:border-b [&>div]:border-[var(--ods-color-gray-200)] [&>div:not(:last-child)]:pb-4 [&>div:not(:last-child)]:mb-3';

const LocalizationSelect = <TCustomData extends TCustomRegionItemData>({
  regions,
  className,
  ...props
}: TLocalizationSelectProps<TCustomData>) => {
  const { t } = useTranslation(['regions', 'common']);

  return (
    <FormField className={className}>
      <FormFieldLabel>
        {t('regions:manager_components_select_localization_label')}
      </FormFieldLabel>
      <Select items={regions} {...props}>
        <SelectControl
          className="h-[2.5em]"
          placeholder={t(
            'regions:manager_component_select_localization_placeholder',
          )}
          customItemRenderer={({
            selectedItems,
          }: SelectCustomItemRendererArg) => (
            <>
              {selectedItems[0] && (
                <Localization
                  name={t(selectedItems[0].label, {
                    micro: (selectedItems[0].customRendererData as TCustomData)
                      .regionId,
                  })}
                  countryCode={
                    (selectedItems[0].customRendererData as TCustomData)
                      .countryCode
                  }
                  deploymentMode={
                    (selectedItems[0].customRendererData as TCustomData)
                      .deploymentMode
                  }
                />
              )}
            </>
          )}
        />
        <SelectContent
          className={continentDividerClassname}
          customGroupRenderer={({ label }) => (
            <span>
              {t(`common:pci_instances_common_instance_continent_${label}`)}
            </span>
          )}
          customOptionRenderer={({
            label,
            customData,
          }: SelectCustomOptionRendererArg) => (
            <Localization
              name={t(label, {
                micro: (customData as TCustomRegionItemData).regionId,
              })}
              countryCode={(customData as TCustomData).countryCode}
              deploymentMode={(customData as TCustomData).deploymentMode}
            />
          )}
        />
      </Select>
    </FormField>
  );
};

export default LocalizationSelect;
