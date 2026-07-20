import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Country } from '@ovh-ux/manager-config';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@ovhcloud/ods-react';
import {
  OdsButton,
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useUserContext } from '@/context/user/useUser';
import { useMe } from '@/data/hooks/useMe';
import { useRules } from '@/data/hooks/useRules';
import { isUnknownCountry, isUserLoggedIn } from '@/helpers/flowHelper';
import { useLocalCountry } from '@/hooks/useLocalCountry/useLocalCountry';
import { urls } from '@/routes/routes.constant';

/**
 * The account creation flow relies on the user country. When the API returns
 * `UNKNOWN` and the locally persisted value (`ovh-country`) has been lost, the
 * country is undefined and the whole connected flow is stuck (empty legal forms
 * on /type, endless skeleton on /details).
 *
 * This modal detects that situation and asks the user to reselect a country,
 * restricted to the ones allowed for their subsidiary (via /newAccount/rules).
 */
export default function CountryRecoveryModal() {
  const { t } = useTranslation(['country-recovery', NAMESPACES.ACTIONS]);
  const { t: tCountry } = useTranslation(NAMESPACES.COUNTRY);
  const location = useLocation();
  const { country, ovhSubsidiary, setCountry } = useUserContext();
  const { data: me, isFetched } = useMe();
  const [localCountry] = useLocalCountry();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // The country is "lost" when neither the API nor the recovered context value
  // is usable. The context `country` is the recovery signal: once the user
  // validates, the provider sets it to a real code, `isUnknownCountry(country)`
  // becomes false and this modal closes. `me.country` and the locally persisted
  // value only guard against flashing the modal during the provider's async
  // initialization for users whose country is actually fine.
  const isCountryLost =
    isUserLoggedIn() &&
    isFetched &&
    Boolean(me) &&
    Boolean(ovhSubsidiary) &&
    isUnknownCountry(me?.country) &&
    isUnknownCountry(country) &&
    !localCountry &&
    location.pathname !== urls.settings;

  const { data: rules, isLoading } = useRules(
    { ovhSubsidiary, language: me?.language ?? undefined },
    ['country'],
    isCountryLost,
  );

  const countryOptions = useMemo(
    () =>
      (rules?.country?.in ?? [])
        .map((code) => ({
          code,
          label: tCountry(`country_${code}`),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [rules?.country?.in, tCountry],
  );

  if (!isCountryLost) {
    return null;
  }

  return (
    <Modal open closeOnEscape={false} closeOnInteractOutside={false}>
      <ModalContent dismissible={false}>
        <ModalHeader>
          <OdsText preset={ODS_TEXT_PRESET.heading3}>{t('title')}</OdsText>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-5">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('description')}
            </OdsText>
            <OdsFormField className="w-full">
              <label className="block" slot="label">
                {t('country_label')} *
              </label>
              <OdsCombobox
                name="recovery-country"
                className="w-full"
                value={selectedCountry ?? ''}
                allowNewElement={false}
                isClearable
                isLoading={isLoading}
                onOdsChange={(evt) => setSelectedCountry(evt.detail.value)}
                data-testid="recovery-country-combobox"
              >
                {countryOptions.map(({ code, label }) => (
                  <OdsComboboxItem
                    value={code}
                    key={`recovery_country_${code}`}
                  >
                    {label}
                  </OdsComboboxItem>
                ))}
              </OdsCombobox>
            </OdsFormField>
            <OdsButton
              className="w-full"
              label={t('validate', { ns: NAMESPACES.ACTIONS })}
              isDisabled={!selectedCountry}
              onClick={() =>
                selectedCountry && setCountry(selectedCountry as Country)
              }
              data-testid="recovery-validate-button"
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
