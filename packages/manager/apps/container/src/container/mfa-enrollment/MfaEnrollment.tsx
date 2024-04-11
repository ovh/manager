import React from 'react';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import img from '@/assets/images/mfa/double-authentication.png';
import img2x from '@/assets/images/mfa/double-authentication@2x.png';
import img3x from '@/assets/images/mfa/double-authentication@3x.png';

import { OsdsButton, OsdsText, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Subtitle } from '@ovhcloud/manager-components';

type MfaEnrollmentProps = {
  forced?: boolean;
  onHide: () => void;
};

const TextContent = ({ children }: { children: string }) => (
  <OsdsText
    level={ODS_TEXT_LEVEL.caption}
    color={ODS_THEME_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._300}
    hue={ODS_TEXT_COLOR_HUE._500}
    className="block mt-2"
  >
    {children}
  </OsdsText>
);

const MfaEnrollment = ({ forced, onHide }: MfaEnrollmentProps) => {
  const { t } = useTranslation('mfa-enrollment');
  const redirectUrl = encodeURIComponent(window.top.location.href);
  const shell = useShell();
  const mfaURL = shell
    .getPlugin('navigation')
    .getURL(
      'dedicated',
      `#/useraccount/security/mfa?redirect_url=${redirectUrl}`,
    );

  const gotoMfa = () => {
    shell.getPlugin('tracking').trackClick({
      name: 'MFA_ENROLLMENT',
      type: 'navigation',
    });
    window.top.location = mfaURL;
    onHide();
  };

  return (
    <div className="relative w-full h-full overflow-y-scroll bg-white-100 z-50">
      <div className="flex justify-center">
        <div className="md:w-7/12 p-4 md:p-5 bg-white min-h-screen">
          <div className="p-0 md:p-5">
            <div className="text-center mb-3">
              <img
                src={img}
                srcSet={`${img2x} 2x, ${img3x} 3x`}
                className="img-fluid"
                alt=""
              />
            </div>

            <Subtitle>{t('mfa_enrollment_title')}</Subtitle>
            <TextContent>{t('mfa_enrollment_info1')}</TextContent>
            <TextContent>{t('mfa_enrollment_info2')}</TextContent>

            <div className="mx-auto my-5 float-right">
              {!forced && (
                <OsdsButton
                  size={ODS_BUTTON_SIZE.sm}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="inline-block"
                  onClick={onHide}
                >
                  <span>{t('mfa_enrollment_cancel')}</span>
                </OsdsButton>
              )}
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.flat}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="inline-block pl-3"
                onClick={gotoMfa}
              >
                {t('mfa_enrollment_go')}
                <span slot="end">
                  <OsdsIcon
                    name={ODS_ICON_NAME.CHEVRON_RIGHT}
                    size={ODS_ICON_SIZE.xs}
                    contrasted
                  />
                </span>
              </OsdsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MfaEnrollment;
