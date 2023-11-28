import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import jumbotron from './error-jumbotron.png';
import './error-jumbotron.styles.scss';
import Context from '@/context';

const ErrorJumbotron = (): JSX.Element => {
  const { t } = useTranslation('restricted');
  const { region } = useContext(Context);
  const isUsRegion = region === 'US';
  return (
    <div className="my-5 error-jumbotron d-flex flex-column">
      <div className="d-flex justify-content-center">
        <img src={jumbotron} className="mw-100" />
      </div>
      <h1 className="oui-heading_4 mt-5">{t('restricted_error_title')}</h1>
      <div className="oui-message oui-message_error" role="alert">
        <span
          className="oui-message__icon oui-icon oui-icon-error-circle"
          aria-hidden="true"
        ></span>
        <p className="oui-message__body">
          {t(`restricted_error_default_start`, {
            count: isUsRegion ? 3 : 4,
          })}
        </p>
        <ul>
          <li>account:apiovh:me/get</li>
          {!isUsRegion && <li>account:apiovh:me/supportLevel/get</li>}
          <li>account:apiovh:me/certificates/get</li>
          <li>account:apiovh:me/tag/get</li>
        </ul>
        <p className="oui-message__body">{t('restricted_error_default_end')}</p>
      </div>
    </div>
  );
};

export default ErrorJumbotron;
