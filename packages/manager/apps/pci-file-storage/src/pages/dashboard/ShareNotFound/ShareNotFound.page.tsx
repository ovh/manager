import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';

import ErrorImg from '../../../../public/assets/error-banner-oops.png';

type ShareNotFoundProps = {
  error: AxiosError;
};

const ShareNotFound: React.FC<ShareNotFoundProps> = ({ error }) => {
  const { t } = useTranslation('dashboard');
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();

  const queryId = error.response?.headers?.['x-ovh-queryid'] as string | undefined;

  return (
    <section className="mx-auto size-full max-w-[600px] overflow-hidden p-5">
      <img src={ErrorImg} alt="OOPS" className="w-full" />
      <Message color={MESSAGE_COLOR.warning} dismissible={false} className="w-full">
        <MessageIcon name="triangle-exclamation" />
        <MessageBody>
          <p className="m-0">
            <span className="block">
              <strong>{t('dashboard:not_found.description', { shareId })}</strong>
            </span>
            {queryId && <span className="block py-[10px]">Error code: {queryId}</span>}
          </p>
        </MessageBody>
      </Message>
      <div className="mt-5 overflow-hidden py-2">
        <Button className="w-full" variant={BUTTON_VARIANT.ghost} onClick={() => navigate('..')}>
          {t('dashboard:not_found.go_back')}
        </Button>
        <Button className="w-full" onClick={() => navigate(0)}>
          {t('dashboard:not_found.reload')}
        </Button>
      </div>
    </section>
  );
};

export default ShareNotFound;
