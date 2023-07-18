import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './skipNav.module.scss';

type Props = {
  iframeRef: RefObject<HTMLIFrameElement>,
};

const SkipNav = ({ iframeRef }: Props): JSX.Element => {
  const { t } = useTranslation('skip-nav');
  const focusOnIframe = () => {
    iframeRef.current?.contentWindow.focus();
  };

  return <div className={ styles.skipnav }>
    <button className="oui-button oui-button_ghost" onClick={() => focusOnIframe()}>{t('skip_nav')}</button>
  </div>
}
export default SkipNav;
