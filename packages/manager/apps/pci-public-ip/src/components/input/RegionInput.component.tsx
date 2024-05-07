import { useCallback, useState } from 'react';
import { useMedia } from 'react-use';
import {
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { GUIDE_URLS, TRACKING_GUIDE_LINKS } from '@/pages/order/constants';
import { useMe } from '@/api/hooks/useMe';
import { TRegion } from '@/api/types';
import { TabsComponent } from '@/components/container/Tabs.component';

type TProps = {
  regions: TRegion[];
  value: TRegion;
  onInput: (value: TRegion) => void;
};

export const RegionInputComponent = ({
  regions,
  value,
  onInput,
}: TProps): JSX.Element => {
  const { me } = useMe();
  const [selectedMacroName, setSelectedMacroName] = useState<string>(null);
  const isDesktop: boolean = useMedia(`(min-width: 760px)`);

  const isMacroRegionStandalone = useCallback(
    (macroName: string) =>
      regions.filter((region) => region.macroName === macroName).length === 1,
    [regions],
  );

  const getMacroRegions = useCallback(
    (continent: string) =>
      regions.filter(
        (region) =>
          (!continent || region.continent === continent) &&
          region.macroName === selectedMacroName,
      ),
    [regions, selectedMacroName],
  );

  const { t: tOrder } = useTranslation('order');
  const { t: tRegion } = useTranslation('regions');

  const titleElement = isDesktop
    ? (continent: string, selected: boolean) => (
        <OsdsText
          breakSpaces={false}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={
            selected
              ? ODS_THEME_COLOR_INTENT.text
              : ODS_THEME_COLOR_INTENT.primary
          }
        >
          <div className="whitespace-nowrap px-2 text-lg font-bold">
            {continent || tRegion('pci_project_regions_list_continent_all')}
          </div>
        </OsdsText>
      )
    : (continent: string, selected: boolean, clickHandler: () => void) => (
        <div
          className={'cursor-pointer p-4'}
          role="button"
          onClick={() => clickHandler?.()}
          onKeyDown={() => clickHandler?.()}
        >
          <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
            {continent || tRegion('pci_project_regions_list_continent_all')}
          </OsdsLink>
          <OsdsIcon
            className="float-right"
            name={
              selected ? ODS_ICON_NAME.CHEVRON_UP : ODS_ICON_NAME.CHEVRON_DOWN
            }
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </div>
      );
  const contentElement = (continent: string) => {
    return (
      <div className="p-6">
        <ul
          className={clsx(
            'grid gap-5 m-0 p-0 list-none',
            isDesktop ? 'grid-cols-3' : 'grid-cols-1',
          )}
        >
          {Array.from(
            new Set(
              (continent === ''
                ? regions
                : regions.filter((region) => region.continent === continent)
              ).map((region) => region.macroName),
            ),
          ).map((macroName) => (
            <li key={macroName}>
              <OsdsTile
                className={clsx(
                  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
                  macroName === selectedMacroName &&
                    'border-[--ods-color-blue-600] font-bold',
                )}
                onClick={() => {
                  setSelectedMacroName(macroName);
                  if (isMacroRegionStandalone(macroName)) {
                    onInput(
                      regions.find((region) => region.macroName === macroName),
                    );
                  }
                }}
              >
                {isMacroRegionStandalone(macroName)
                  ? regions.find((region) => region.macroName === macroName)
                      .microName
                  : macroName}
              </OsdsTile>
            </li>
          ))}
        </ul>
        {selectedMacroName &&
          !isMacroRegionStandalone(selectedMacroName) &&
          getMacroRegions(continent).length > 0 && (
            <>
              <div className="mt-6">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tRegion('pci_project_regions_list_region')}
                </OsdsText>
              </div>
              <ul
                className={clsx(
                  'grid gap-5 m-0 p-0 list-none mt-8',
                  isDesktop ? 'grid-cols-3' : 'grid-cols-1',
                )}
              >
                {getMacroRegions(continent).map((region) => (
                  <li key={region.microName}>
                    <OsdsTile
                      className={clsx(
                        'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
                        region.microName === value?.microName &&
                          'border-[--ods-color-blue-600] font-bold',
                      )}
                      onClick={() => {
                        onInput(region);
                      }}
                    >
                      {region.microName}
                    </OsdsTile>
                  </li>
                ))}
              </ul>
            </>
          )}
      </div>
    );
  };

  return (
    <>
      <OsdsText size={ODS_TEXT_SIZE._400} color={ODS_TEXT_COLOR_INTENT.text}>
        <span
          dangerouslySetInnerHTML={{
            __html: tOrder(
              'pci_additional_ip_create_step_select_region_description_floating_ip',
              {
                guideLink:
                  GUIDE_URLS.REGIONS_AVAILABILITY[me?.ovhSubsidiary] ||
                  GUIDE_URLS.REGIONS_AVAILABILITY.DEFAULT,
                trackLabel:
                  TRACKING_GUIDE_LINKS.FLOATING_IP_REGION_AVAILABILITY,
              },
            ),
          }}
        ></span>
      </OsdsText>
      <TabsComponent
        className="mt-4"
        id="test"
        items={Array.from(
          new Set(['', ...regions.map((region) => region.continent)]),
        )}
        titleElement={titleElement}
        contentElement={contentElement}
      />
    </>
  );
};
