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
import {
  getvrackServicesReferenceRegionListQueryKey,
  getvrackServicesReferenceRegionList,
} from '@/api';
import { regionInputName } from '../constants';

export type Props = {
  isReadOnly?: boolean;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
};

const regionNameToIsoCode: { [prop: string]: ODS_COUNTRY_ISO_CODE } = {
  RBX: ODS_COUNTRY_ISO_CODE.FR,
  LIM: ODS_COUNTRY_ISO_CODE.DE,
  BHS: ODS_COUNTRY_ISO_CODE.CA,
};

export const RegionFormField: React.FC<Props> = ({
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
              const [country, city] = region.description.split('-');
              return (
                <OsdsRadio
                  className="w-[165px] mr-5 mb-5"
                  id={region.code}
                  key={region.code}
                  value={region.code}
                  name={regionInputName}
                  checked={selectedRegion === region.code || undefined}
                  disabled={isReadOnly || undefined}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                      setSelectedRegion(region.code);
                    }
                  }}
                >
                  <OsdsTile
                    className="flex flex-col h-full w-[165px]"
                    hoverable
                    color={ODS_THEME_COLOR_INTENT.primary}
                    checked={selectedRegion === region.code || undefined}
                    onClick={() => {
                      setSelectedRegion(region.code);
                    }}
                  >
                    <div slot="start" className="w-full">
                      <OsdsFlag
                        className="w-11 mx-auto"
                        iso={
                          regionNameToIsoCode[region.code] ||
                          ODS_COUNTRY_ISO_CODE.FR
                        }
                        lazy
                        assetPath="flags/"
                      />
                    </div>
                    <OsdsText
                      className="block mt-6 mb-1"
                      size={ODS_TEXT_SIZE._200}
                      level={ODS_TEXT_LEVEL.heading}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {country}
                    </OsdsText>
                    <div slot="end" className="w-full">
                      <OsdsText
                        className="mx-auto"
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                        color={ODS_THEME_COLOR_INTENT.text}
                      >
                        {`${city || ''} (${region.code})`}
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
