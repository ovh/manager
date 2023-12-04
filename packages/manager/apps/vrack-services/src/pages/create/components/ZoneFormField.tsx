import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import { OsdsFlag } from '@ovhcloud/ods-components/flag/react';
import { ODS_COUNTRY_ISO_CODE } from '@ovhcloud/ods-common-core';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { OsdsTile } from '@ovhcloud/ods-components/tile/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import {
  OsdsRadioGroup,
  OsdsRadio,
} from '@ovhcloud/ods-components/radio/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  getvrackServicesReferenceZoneListQueryKey,
  getvrackServicesReferenceZoneList,
} from '@/api';
import { zoneInputName } from '../constants';

export type Props = {
  isReadOnly?: boolean;
  selectedZone: string;
  setSelectedZone: React.Dispatch<React.SetStateAction<string>>;
};

const zoneNameToIsoCode: { [prop: string]: ODS_COUNTRY_ISO_CODE } = {
  RBX: ODS_COUNTRY_ISO_CODE.FR,
  LIM: ODS_COUNTRY_ISO_CODE.DE,
  BHS: ODS_COUNTRY_ISO_CODE.CA,
};

export const ZoneFormField: React.FC<Props> = ({
  isReadOnly,
  selectedZone,
  setSelectedZone,
}) => {
  const { t } = useTranslation('vrack-services/create');

  const { data, isLoading: isZoneLoading } = useQuery({
    queryKey: getvrackServicesReferenceZoneListQueryKey,
    queryFn: getvrackServicesReferenceZoneList,
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
        {t('zoneLabel')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        className="block mb-6"
      >
        {t('zoneDescription')}
      </OsdsText>
      {isZoneLoading ? (
        <div className="mb-5">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : (
        <OsdsFormField className="mb-5">
          <OsdsRadioGroup
            className="flex overflow-x-auto"
            name={zoneInputName}
            value={selectedZone}
            required
          >
            {data?.data.map((zone) => {
              const [country, city] = zone.description.split('-');
              return (
                <OsdsRadio
                  className="w-[165px] mr-5 mb-5"
                  id={zone.name}
                  key={zone.name}
                  value={zone.name}
                  name={zoneInputName}
                  checked={selectedZone === zone.name || undefined}
                  disabled={isReadOnly || undefined}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                      setSelectedZone(zone.name);
                    }
                  }}
                >
                  <OsdsTile
                    className="flex flex-col h-full w-[165px]"
                    hoverable
                    color={ODS_THEME_COLOR_INTENT.primary}
                    checked={selectedZone === zone.name || undefined}
                    onClick={() => {
                      setSelectedZone(zone.name);
                    }}
                  >
                    <div slot="start" className="w-full">
                      <OsdsFlag
                        className="w-11 mx-auto"
                        iso={zoneNameToIsoCode[zone.name]}
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
                      >{`${city} (${zone.name})`}</OsdsText>
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
