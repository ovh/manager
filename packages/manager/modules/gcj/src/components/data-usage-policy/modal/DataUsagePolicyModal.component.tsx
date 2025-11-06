import { useCallback, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Subsidiary, Region } from '@ovh-ux/manager-config';
import { TrackingPlugin } from '@ovh-ux/shell';
import { Links, Modal, Subtitle } from '@ovh-ux/manager-react-components';
import { useDataUsageConsent } from '@/hooks/dataUsageConsent/useDataUsageConsent';
import { useDataUsageInfoLink } from '@/hooks/dataUsageConsent/useDataUsageLink';

import ovhCloudLogo from '@/assets/logo-ovhcloud.png';

import './translations';

type Props = {
  subsidiary?: Subsidiary;
  region: Region;
  trackingPlugin: TrackingPlugin;
  onModalHidden?: () => void;
};

export const DataUsagePolicyModal = ({
  subsidiary,
  region,
  trackingPlugin,
  onModalHidden,
}: Props) => {
  const { t } = useTranslation('data-usage-policy');
  const { shouldRequestConsent, setConsent } = useDataUsageConsent(
    region,
    trackingPlugin,
  );
  const moreInfoLink = useDataUsageInfoLink(region, subsidiary);

  const onButtonClick = useCallback((consent: boolean) => {
    setConsent(consent);
    onModalHidden?.();
  }, []);

  useEffect(() => {
    if (shouldRequestConsent === false) {
      onModalHidden?.();
    }
  }, [shouldRequestConsent]);

  return (
    shouldRequestConsent && (
      <Modal
        type={ODS_MODAL_COLOR.information}
        primaryLabel={t('cookie_policy_accept')}
        secondaryLabel={t('cookie_policy_refuse')}
        onPrimaryButtonClick={() => onButtonClick(true)}
        onSecondaryButtonClick={() => onButtonClick(false)}
      >
        <div>
          <div className="w-full flex justify-center items-center mb-6">
            <img src={ovhCloudLogo} alt="ovh-cloud-logo" />
          </div>
          <div className="text-center mb-6">
            <Subtitle>
              <OdsText preset={ODS_TEXT_PRESET.heading3}>
                {t('cookie_policy_title')}
              </OdsText>
            </Subtitle>
          </div>
          <div className="inline-flex mb-6">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans
                t={t}
                i18nKey="cookie_policy_description_1"
                components={{
                  Link: (
                    <Links
                      href={moreInfoLink}
                      label={t('cookie_policy_description_1_more_informations')}
                      target="_blank"
                    />
                  ),
                }}
              />
            </OdsText>
          </div>
          <ul>
            <li>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('cookie_policy_description_3')}
              </OdsText>
            </li>
          </ul>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('cookie_policy_description_2')}
          </OdsText>
          <div className="mb-4">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('cookie_policy_description_4')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {/* This link should redirect to a configuration page for the cookies, but such page does not exist */}
              <Trans
                t={t}
                i18nKey="cookie_policy_description_5"
                components={{
                  Link: (
                    <Links
                      href={moreInfoLink}
                      label={t('cookie_policy_description_5_link')}
                      target="_blank"
                    />
                  ),
                }}
              />
            </OdsText>
          </div>
        </div>
      </Modal>
    )
  );
};
