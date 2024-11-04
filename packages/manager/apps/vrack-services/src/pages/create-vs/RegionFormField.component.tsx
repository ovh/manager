import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  OsdsFlag,
  OsdsFormField,
  OsdsSpinner,
  OsdsTile,
  OsdsRadioGroup,
  OsdsRadio,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_COUNTRY_ISO_CODE } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Region } from '@ovh-ux/manager-react-components';
import {
  getvrackServicesReferenceRegionListQueryKey,
  getvrackServicesReferenceRegionList,
} from '@/data';
import {
  regionInputName,
  regionNameToIsoCode,
} from './createVrackServices.constants';

export type RegionFormFieldProps = {
  isReadOnly?: boolean;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

export const RegionFormField: React.FC<RegionFormFieldProps> = ({
  isReadOnly,
  selectedRegion,
  setSelectedRegion,
}) => {
  const { t } = useTranslation('vrack-services/create');

  const { data, isLoading: isRegionLoading } = useQuery({
    queryKey: getvrackServicesReferenceRegionListQueryKey,
    queryFn: getvrackServicesReferenceRegionList,
    staleTime: Infinity,
  });

  return (
    <>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block mt-8 mb-4"
      >
        {t('regionLabel')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        className="block mb-6"
      >
        {t('regionDescription')}
      </OsdsText>
      {isRegionLoading ? (
        <div className="mb-5">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <OsdsFormField className="mb-5">
          <OsdsRadioGroup
            className="flex overflow-x-auto"
            name={regionInputName}
            value={selectedRegion}
            required
          >
            {data?.data?.map((region) => {
              const [, , code] = region.name?.split('-');
              return (
                <OsdsRadio
                  className="mr-5 mb-5"
                  id={region.name}
                  key={region.name}
                  value={region.name}
                  name={regionInputName}
                  checked={selectedRegion === region.name || undefined}
                  disabled={isReadOnly || undefined}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                      setSelectedRegion(region.name);
                    }
                  }}
                >
                  <OsdsTile
                    className="flex flex-col h-full w-full"
                    hoverable
                    color={ODS_THEME_COLOR_INTENT.primary}
                    checked={selectedRegion === region.name || undefined}
                    onClick={() => {
                      setSelectedRegion(region.name);
                    }}
                  >
                    <div slot="start" className="flex h-full w-full p-1 m-1">
                      <OsdsText
                        className="flex-col mb-5 mr-11"
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        <Region
                          mode="region"
                          name={region.name?.toLowerCase()}
                        ></Region>
                      </OsdsText>
                      <OsdsFlag
                        className="flex-col w-5 h-5"
                        iso={
                          regionNameToIsoCode[code.toUpperCase()] ||
                          ODS_COUNTRY_ISO_CODE.FR
                        }
                        lazy
                        assetPath="flags/"
                      />
                    </div>
                    <div slot="end" className="w-full">
                      <OsdsText
                        className="mx-auto"
                        size={ODS_TEXT_SIZE._300}
                        level={ODS_TEXT_LEVEL.body}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        {`${region.name || ''}`}
                      </OsdsText>
                    </div>
                  </OsdsTile>
                </OsdsRadio>
              );
            })}
          </OsdsRadioGroup>
        </OsdsFormField>
      )}
    </>
  );
};
