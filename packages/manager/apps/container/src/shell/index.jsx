import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { plugin, IFrameMessageBus, UxModal } from '@ovh-ux/shell';
import { useTranslation } from 'react-i18next';

import ApplicationContext from '../context';

import ShellHeader from './header';
import style from './shell.module.scss';

const CookiePolicy = ({ trackingPlugin }) => {
  console.log(trackingPlugin);
  const { t } = useTranslation('cookie-policy');
  const moreInfoLink = '';
  const clickHereLink = '';

  useEffect(() => {
    const accept = (contentObject) => {
      console.log('in');
      trackingPlugin.init();
      contentObject.hide();
    };

    const deny = (contentObject) => {
      contentObject.hide();
    };
    const template = document.getElementById('manager-cookie-policy-banner-modal');
    const modalContent = document.importNode(template, true).firstElementChild;
    const modalContentObj = new UxModal({
      content: modalContent,
      size: 'lg',
      className: 'manager-cookie-policy-banner',
    });
    modalContentObj.show();

    modalContent.querySelector('accept').onclick = () => {
      accept(modalContentObj);
    };

    modalContent.querySelector('deny').onclick = () => {
      deny(modalContentObj);
    };
  }, []);

  return (
    <template id="manager-cookie-policy-banner-modal">
      <div>
        <div className="img-wrapper w-100 d-flex justify-content-center align-items-center">
          <img src="" alt="ovh-cloud-logo" />
        </div>
        <h4 className="text-center">{t('cookie_policy_title')}</h4>
        <p>{t('cookie_policy_description_1', { url: moreInfoLink })}</p>
        <ul>
          <li>{t('cookie_policy_description_3')}</li>
        </ul>
        <p>{t('cookie_policy_description_2')}</p>
        <span>{t('cookie_policy_description_4')}</span>
        <span>{t('cookie_policy_description_5', { url: clickHereLink })}</span>
        <div className="banner-buttons w-100 d-flex justify-content-center align-items-center flex-column">
          <button className="accept" variant="primary">
            <span>{t('cookie_policy_accept')}</span>
          </button>
          <button className="deny" variant="secondary">
            <span>{t('cookie_policy_refuse')}</span>
          </button>
        </div>
      </div>
    </template>
  );
};

function Shell() {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [router, setRouter] = useState(null);
  const { shell } = useContext(ApplicationContext);

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  useEffect(() => {
    const routing = plugin.routing.initRouting(iframeRef.current);
    shell.registerPlugin('routing', routing);
    setRouter(routing.router);
  }, [iframeRef, shell]);

  return (
    <div className={style.managerShell}>
      {router}
      <div className={style.managerShell_header}>
        <ShellHeader />
      </div>
      <div className={style.managerShell_content}>
        <iframe
          label="app"
          role="document"
          src="about:blank"
          ref={iframeRef}
        ></iframe>
      </div>
      <div className={style.managerShell_footer}></div>
      <Suspense fallback="...">
        <CookiePolicy trackingPlugin={shell.getPlugin('tracking')} />
      </Suspense>
    </div>
  );
}

export default Shell;
