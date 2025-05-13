import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { clsx } from 'clsx';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_COLOR_INTENT, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useRef } from 'react';
import { GUIDE_URLS, TRACKING_GUIDE_LINKS } from '@/pages/order/constants';
import { TCountry } from '@/api/types';
import { useMe } from '@/api/hooks/useMe';
import { useTrackTranslationLink } from '@/hooks/useTrackTranslationLink';

export const CountryInputComponent = ({
  countries,
  value,
  onInput,
}: {
  countries: TCountry[];
  value: TCountry;
  onInput: (value: TCountry) => void;
}): JSX.Element => {
  const { t: tCountries } = useTranslation('countries');
  const { t: tOrder } = useTranslation('order');

  const { me } = useMe();

  const trackRef = useRef<HTMLElement>(null);

  useTrackTranslationLink(trackRef);

  return (
    <>
      <div>
        <OsdsText size={ODS_TEXT_SIZE._400} color={ODS_TEXT_COLOR_INTENT.text}>
          <span
            ref={trackRef}
            dangerouslySetInnerHTML={{
              __html: tOrder(
                'pci_additional_ip_create_step_select_region_description_failover_ip',
                {
                  guideLink:
                    GUIDE_URLS.FAILOVER_IP[me?.ovhSubsidiary] ||
                    GUIDE_URLS.FAILOVER_IP.DEFAULT,
                  trackLabel: TRACKING_GUIDE_LINKS.DISCOVER_FAILOVER_IP,
                },
              ),
            }}
          ></span>
        </OsdsText>
      </div>
      <ul className="grid gap-8 list-none p-0 mx-0 mb-0 mt-7 grid-cols-1 md:grid-cols-3">
        {countries.map((country) => (
          <li key={country.name} className="w-full px-1">
            <OsdsTile
              checked={value?.name === country.name}
              onClick={() => onInput(country)}
              className={clsx(
                'cursor-pointer p-8 border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]',
                value?.name === country.name &&
                  'font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]',
              )}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
              >
                <span className={value?.name === country.name && 'font-bold'}>
                  {tCountries(`pci_additional_ips_country_${country.name}`)}
                </span>
              </OsdsText>
            </OsdsTile>
          </li>
        ))}
      </ul>
    </>
  );
};
