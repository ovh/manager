import React, { useEffect } from 'react';
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
import { ErrorProps } from './Error.props';
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
  const isBoundaryError =
    typeof error === 'undefined' ||
    error === null ||
    (typeof error === 'object' &&
      error !== null &&
      typeof error === 'object' &&
      Object.keys(error)?.length === 0);

  useEffect(() => {
    const env = shell?.environment?.getEnvironment();
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
      <Text preset={TEXT_PRESET.heading1} className="pt-2">
        {error?.status === 404 && <> {t('manager_error_page_404_title')}</>}
        {error?.status && error?.status !== 404 && (
          <>{t('manager_error_api_page_title')}</>
        )}
        {isBoundaryError && <> {t('manager_error_page_boundary_title')}</>}
      </Text>
      <Text preset={TEXT_PRESET.heading2} className="pt-1 pb-2">
        {error?.status === 404 && (
          <>{t('manager_error_page_404_description')}</>
        )}
        {error?.status && error?.status !== 404 && (
          <>{t('manager_error_page_api_description')}</>
        )}
        {isBoundaryError && (
          <> {t('manager_error_page_boundary_description')}</>
        )}
      </Text>
      {error?.status !== 404 &&
        (error?.data?.message || error?.headers?.['x-ovh-queryid']) && (
          <Message
            color={MESSAGE_COLOR.warning}
            data-tracking={labelTracking}
            dismissible={false}
            className="w-full"
          >
            <MessageIcon name="triangle-exclamation" />
            <MessageBody>
              <p className="m-0 p-O">
                {error?.data?.message && (
                  <span className="block">
                    <strong>{error.data.message}</strong>
                  </span>
                )}
                {error?.headers?.['x-ovh-queryid'] && (
                  <span className="block py-[10px]">
                    {t('manager_error_page_detail_code')}
                    {error.headers['x-ovh-queryid']}
                  </span>
                )}
              </p>
            </MessageBody>
          </Message>
        )}
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
