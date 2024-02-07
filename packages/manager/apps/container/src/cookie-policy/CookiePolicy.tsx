import React, { useState, useEffect } from 'react';

import { Shell } from '@ovh-ux/shell';
import { Modal } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { User } from '@ovh-ux/manager-config';

import ovhCloudLogo from './assets/logo-ovhcloud.png';
import links from './links';
import './style.scss';
import modalStyle from './cookie-modal.module.scss';

import { useApplication } from '@/context';

type Props = {
  shell: Shell;
  onValidate: Function
};

const CookiePolicy = ({ shell, onValidate }: Props): JSX.Element => {
  const { t } = useTranslation('cookie-policy');
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING']);
  const { environment } = useApplication();
  const [show, setShow] = useState(false);
  const { ovhSubsidiary } = shell.getPlugin('environment').getEnvironment()
    .user as User;
  const trackingPlugin = shell.getPlugin('tracking');

  const validate = (agreed: boolean): void => {
    setCookies('MANAGER_TRACKING', agreed ? 1 : 0);
    trackingPlugin.onUserConsentFromModal(agreed);
    setShow(false);
    onValidate(true);
  }

  useEffect(() => {
    const isRegionUS = environment.getRegion() === 'US'
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
  }, []);

  const moreInfoLink = links.moreInfo[ovhSubsidiary];
  const clickHereLink = links.changeOpinionLink[ovhSubsidiary];

  const moreInfoHtml = () => {
    return {
      __html: t('cookie_policy_description_1', {
        url: moreInfoLink,
      }),
    };
  };
  const clickHereHtml = () => {
    return {
      __html: t('cookie_policy_description_5', {
        url: clickHereLink,
      }),
    };
  };

  return (
    <Modal
      size="lg"
      show={show}
      backdrop="static"
      keyboard={false}
      animation={false}
    >
      <Modal.Body>
        <div className="p-1">
          <div className="img-wrapper w-100 d-flex justify-content-center align-items-center">
            <img src={ovhCloudLogo} alt="ovh-cloud-logo" />
          </div>
          <h4 className={`${modalStyle.title} text-center`}>
            {t('cookie_policy_title')}
          </h4>
          <p dangerouslySetInnerHTML={moreInfoHtml()}></p>
          <ul className={modalStyle.list}>
            <li>{t('cookie_policy_description_3')}</li>
          </ul>
          <p className="mb-3">{t('cookie_policy_description_2')}</p>
          <span>{t('cookie_policy_description_4')}</span>

          <span dangerouslySetInnerHTML={clickHereHtml()}></span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="banner-buttons w-100 d-flex flex-wrap justify-content-center align-items-center flex-column">
          <button
            onClick={() => validate(true)}
            className="accept mb-2 oui-button oui-button_primary"
            data-navi-id="cookie-accept"
          >
            <span>{t('cookie_policy_accept')}</span>
          </button>
          <button
            onClick={() => validate(false)}
            className="deny oui-button oui-button_secondary"
          >
            <span>{t('cookie_policy_refuse')}</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CookiePolicy;
