import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCookies } from 'react-cookie';
import PropTypes from 'prop-types';

import { useApplication } from '@/context';

import ovhCloudLogo from './assets/logo-ovhcloud.png';
import links from './links';
import './style.scss';

const trackingEnabled = process.env.NODE_ENV === 'production';

const CookiePolicy = (props) => {
  const { t } = useTranslation('cookie-policy');
  const [cookies, setCookies] = useCookies(['MANAGER_TRACKING']);
  const { environment } = useApplication();
  const { shell } = props;
  const [show, setShow] = useState(false);
  const { ovhSubsidiary } = shell
    .getPlugin('environment')
    .getEnvironment().user;
  const trackingPlugin = shell.getPlugin('tracking');

  const accept = () => {
    setCookies('MANAGER_TRACKING', 1);
    trackingPlugin.setEnabled(trackingEnabled);
    trackingPlugin.setRegion(environment.getRegion());
    trackingPlugin.init();

    setShow(false);
  };

  const deny = () => {
    setCookies('MANAGER_TRACKING', 0);
    trackingPlugin.setEnabled(trackingEnabled);
    trackingPlugin.clearTrackQueue();
    trackingPlugin.init();

    trackingPlugin.trackClick({
      type: 'action',
      name: 'cookie-banner-manager::decline',
    });

    trackingPlugin.setEnabled(false);

    setShow(false);
  };

  useEffect(() => {
    // Checking if cookie exists
    if (cookies.MANAGER_TRACKING == null) {
      setShow(true);
    } else if (cookies.MANAGER_TRACKING === '1') {
      trackingPlugin.setEnabled(trackingEnabled);
      trackingPlugin.init();
    }
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
    <Modal size="lg" show={show} backdrop="static" keyboard={false}>
      <Modal.Body>
        <div className="cookie-policy-modal p-1">
          <div className="img-wrapper w-100 d-flex justify-content-center align-items-center">
            <img src={ovhCloudLogo} alt="ovh-cloud-logo" />
          </div>
          <h4 className="text-center">{t('cookie_policy_title')}</h4>
          <p dangerouslySetInnerHTML={moreInfoHtml()}></p>
          <ul>
            <li>{t('cookie_policy_description_3')}</li>
          </ul>
          <p>{t('cookie_policy_description_2')}</p>
          <span>{t('cookie_policy_description_4')}</span>

          <span dangerouslySetInnerHTML={clickHereHtml()}></span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="banner-buttons w-100 d-flex flex-wrap justify-content-center align-items-center flex-column">
          <button
            onClick={() => accept()}
            className="accept mb-2 oui-button oui-button_primary"
          >
            <span>{t('cookie_policy_accept')}</span>
          </button>
          <button
            onClick={() => deny()}
            className="deny oui-button oui-button_secondary"
          >
            <span>{t('cookie_policy_refuse')}</span>
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

CookiePolicy.propTypes = {
  shell: PropTypes.object,
};

CookiePolicy.displayName = 'CookiePolicy';

export default CookiePolicy;
