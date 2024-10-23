import { useState, useEffect } from 'react';
import { Shell } from '@ovh-ux/shell';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { User } from '@ovh-ux/manager-config';
import ovhCloudLogo from './assets/logo-ovhcloud.png';
import links from './links';
import { useApplication } from '@/context';
import { Subtitle, Links, LinksProps } from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

type Props = {
  shell: Shell;
  onValidate: Function
};

const ModalContent = ({ label }: { label: string }) => (
  <OsdsText
    level={ODS_TEXT_LEVEL.caption}
    color={ODS_THEME_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._300}
    hue={ODS_TEXT_COLOR_HUE._500}
  >
    {label}
  </OsdsText>
);

const CookiePolicy = ({ shell, onValidate }: Props): JSX.Element => {
  const { t } = useTranslation('cookie-policy');
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING']);
  const { environment } = useApplication();
  const [show, setShow] = useState(false);
  const { ovhSubsidiary } = shell.getPlugin('environment').getEnvironment()
    .user as User;
  const trackingPlugin = shell.getPlugin('tracking');

  const linksArray: LinksProps[] = [
    {
      href: links.moreInfo[ovhSubsidiary],
      label: t('cookie_policy_description_1_more_informations'),
      target: OdsHTMLAnchorElementTarget._blank,
    },
    {
      href: links.changeOpinionLink[ovhSubsidiary],
      label: t('cookie_policy_description_5_link'),
      target: OdsHTMLAnchorElementTarget._blank,
    },
  ];

  const validate = (agreed: boolean) => {
    setCookies('MANAGER_TRACKING', agreed ? 1 : 0);
    trackingPlugin.onUserConsentFromModal(agreed);
    setShow(false);
    onValidate(true);
  }

  useEffect(() => {
    const isRegionUS = environment.getRegion() === 'US';
    trackingPlugin.setRegion(environment.getRegion());
    // activate tracking if region is US or if tracking consent cookie is valid
    if (isRegionUS || cookies.MANAGER_TRACKING === '1') {
      trackingPlugin.init(true);
    } else if (cookies.MANAGER_TRACKING == null) {
      trackingPlugin.onConsentModalDisplay();
      setShow(true);
    } else {
      trackingPlugin.setEnabled(false);
    }
    onValidate(isRegionUS || cookies.MANAGER_TRACKING);
  }, [show]);

  return (
    <>
      {show && (
        <OsdsModal dismissible={false} onClick={(e) => e.stopPropagation()}>
          <div className="p-1">
            <div className="w-full flex justify-center items-center">
              <img src={ovhCloudLogo} alt="ovh-cloud-logo" />
            </div>
            <div className="text-center m-4">
              <Subtitle>{t('cookie_policy_title')}</Subtitle>
            </div>
            <div className='mb-3'>
              <ModalContent label={t('cookie_policy_description_1')} />
              <span className="inline-block">
                <Links href={linksArray[0].href} label={linksArray[0].label} />
              </span>
            </div>
            <ul><li><ModalContent label={t('cookie_policy_description_3')} /></li></ul>
            <ModalContent label={t('cookie_policy_description_2')} />
            <div>
              <ModalContent label={t('cookie_policy_description_4')} />
              <ModalContent label={t('cookie_policy_description_5')} />
              <span className="inline-block">
                <Links href={linksArray[0].href} label={linksArray[1].label} />
              </span>
            </div>
          </div>

          <OsdsButton
            slot="actions"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => validate(false)}
          >
            {t('cookie_policy_refuse')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            onClick={() => validate(true)}
            data-navi-id="cookie-accept"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            >

            {t('cookie_policy_accept')}
          </OsdsButton>
        </OsdsModal>
      )}
    </>
  );
};

export default CookiePolicy;
