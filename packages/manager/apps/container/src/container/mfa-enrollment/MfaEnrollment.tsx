import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import img from '@/assets/images/mfa/double-authentication.png';
import img2x from '@/assets/images/mfa/double-authentication@2x.png';
import img3x from '@/assets/images/mfa/double-authentication@3x.png';

import style from './style.module.scss';

type MfaEnrollmentProps = {
  forced?: boolean;
  onHide: CallableFunction;
};

export default function MfaEnrollment({ forced, onHide }: MfaEnrollmentProps) {
  const { t } = useTranslation('mfa-enrollment');
  const redirectUrl = encodeURIComponent(window.top.location.href);
  const shell = useShell();
  const mfaURL = shell
    .getPlugin('navigation')
    .getURL('dedicated', `#/useraccount/security/mfa?redirect_url=${redirectUrl}`);

  const gotoMfa = () => {
    shell.getPlugin('tracking').trackClick({
      name: 'MFA_ENROLLMENT',
      type: 'navigation',
    });
    window.top.location = mfaURL;
    onHide();
  };

  return (
    <div className={style.mfa_container}>
      <div className="container-fluid">
        <div className="row minh-100 justify-content-md-center d-flex">
          <div className="col-md-7 p-4 p-md-5 bg-white minh-100">
            <div className="p-0 p-md-5">
              <div className="text-center mb-3">
                <img
                  src={img}
                  srcSet={`${img2x} x2, ${img3x} x3`}
                  className="img-fluid"
                />
              </div>

              <h1 className="oui-heading_4">{t('mfa_enrollment_title')}</h1>
              <p>{t('mfa_enrollment_info1')}</p>
              <p>{t('mfa_enrollment_info2')}</p>
              <div className="mx-auto my-5 float-right">
                {!forced && (
                  <button
                    className="oui-button oui-button_secondary m-2"
                    onClick={() => onHide()}
                  >
                    <span>{t('mfa_enrollment_cancel')}</span>
                  </button>
                )}
                <button
                  className="oui-button oui-button_primary oui-button_icon-right m-2"
                  onClick={gotoMfa}
                >
                  <span>{t('mfa_enrollment_go')}</span>
                  <span
                    className="oui-icon oui-icon-chevron-right"
                    aria-hidden="true"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
