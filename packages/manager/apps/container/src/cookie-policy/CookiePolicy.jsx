import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import ovhCloudLogo from './assets/logo-ovhcloud.png';
import links from './links';
import './style.scss';

const CookiePolicy = React.forwardRef((props, ref) => {
  const { t } = useTranslation('cookie-policy');
  const { ovhSubsidiary } = props.shell
    .getPlugin('environment')
    .getEnvironment().user;

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
    <template ref={ref} id="manager-cookie-policy-banner-modal">
      <div className="cookie-policy-modal">
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
        <div className="banner-buttons w-100 d-flex flex-wrap justify-content-center align-items-center flex-column">
          <button className="accept mb-2 oui-button oui-button_primary">
            <span>{t('cookie_policy_accept')}</span>
          </button>
          <button className="deny oui-button oui-button_secondary">
            <span>{t('cookie_policy_refuse')}</span>
          </button>
        </div>
      </div>
    </template>
  );
});

CookiePolicy.propTypes = {
  shell: PropTypes.object,
};

CookiePolicy.displayName = 'CookiePolicy';

export default CookiePolicy;
