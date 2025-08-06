import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  Button,
  Message,
  MessageIcon,
  MessageBody,
  BUTTON_VARIANT,
  MESSAGE_COLOR,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { PageType, ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ErrorProps } from './Error.types';
import './translations/translations';
import { getTrackingTypology } from './Error.utils';
import ErrorImg from '../../../public/assets/error-banner-oops.png';

export const Error = ({
  error,
  onRedirectHome,
  onReloadPage,
  labelTracking,
  ...rest
}: ErrorProps) => {
  const { t } = useTranslation('error');
  const { shell } = React.useContext(ShellContext);
  const env = shell?.environment?.getEnvironment();

  React.useEffect(() => {
    env?.then((response) => {
      const { applicationName } = response;
      const name = `errors::${getTrackingTypology(error)}::${applicationName}`;
      shell?.tracking?.trackPage({
        name,
        level2: '81',
        type: 'navigation',
        page_category: PageType.bannerError,
      });
    });
  }, []);

  return (
    <section
      className="mx-auto w-full h-full max-w-[600px] overflow-hidden mx-autogrid p-5"
      {...rest}
    >
      <img src={ErrorImg} alt="OOPS" className="w-full" />
      <div className="py-2">
        <Text preset={TEXT_PRESET.heading1}>
          {t('manager_error_page_title')}
        </Text>
      </div>
      <div>
        <Message
          color={MESSAGE_COLOR.warning}
          data-tracking={labelTracking}
          dismissible={false}
          className="w-full"
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>
            <p className="m-0 p-O">
              <span className="block">{t('manager_error_page_default')}</span>
              <span className="block">
                {error?.data?.message && <strong>{error.data.message}</strong>}
              </span>
              {error?.headers?.['x-ovh-queryid'] && (
                <span className="block py-[10px]">
                  {t('manager_error_page_detail_code')}
                  {error.headers['x-ovh-queryid']}
                </span>
              )}
            </p>
          </MessageBody>
        </Message>
      </div>
      <div className="overflow-hidden mt-5 py-2">
        <Button
          data-testid="error-template-action-home"
          className="error-template-actions w-full"
          variant={BUTTON_VARIANT.ghost}
          onClick={onRedirectHome}
        >
          {t('manager_error_page_action_home_label')}
        </Button>
        <Button
          data-testid="error-template-action-reload"
          className="error-template-actions w-full"
          onClick={onReloadPage}
        >
          {t('manager_error_page_action_reload_label')}
        </Button>
      </div>
    </section>
  );
};
