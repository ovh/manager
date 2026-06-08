import { useContext } from 'react';

import { useParams } from 'react-router-dom';

import { Trans } from 'react-i18next';

import {
  ICON_NAME,
  Link,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useHasIolbLoadBalancers } from '@/api/hooks/useLoadBalancers';
import { LOAD_BALANCER_EOL_MIGRATE_DOC, LOAD_BALANCER_EOL_STATUS } from '@/constants';
import useLoadBalancerEosAvailable from '@/hooks/useLoadBalancerEosAvailable';

type LoadBalancerEolBannerProps = {
  namespace?: 'listing' | 'onboarding';
};

const BANNER_I18N_KEY: Record<NonNullable<LoadBalancerEolBannerProps['namespace']>, string> = {
  listing: 'kube_list_load_balancer_eol',
  onboarding: 'kube_onboarding_load_balancer_eol',
};

export default function LoadBalancerEolBanner({
  namespace = 'listing',
}: LoadBalancerEolBannerProps) {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { projectId } = useParams();

  const {
    isAvailable: isFlagAvailable,
    isLoading: isFlagLoading,
    isError: isFlagError,
  } = useLoadBalancerEosAvailable();

  const isPresenceRequired = namespace === 'listing';
  const {
    hasIolbLoadBalancer,
    isLoading: isPresenceLoading,
    isError: isPresenceError,
  } = useHasIolbLoadBalancers(projectId ?? '', isPresenceRequired);

  const isLoading = isFlagLoading || (isPresenceRequired && isPresenceLoading);
  const isError = isFlagError || (isPresenceRequired && isPresenceError);
  if (isLoading || isError) {
    return null;
  }

  const shouldDisplay = isPresenceRequired
    ? isFlagAvailable && hasIolbLoadBalancer
    : isFlagAvailable;
  if (!shouldDisplay) {
    return null;
  }

  const migrateDocumentationLink =
    LOAD_BALANCER_EOL_MIGRATE_DOC[ovhSubsidiary] ?? LOAD_BALANCER_EOL_MIGRATE_DOC.DEFAULT;
  const statusLink = LOAD_BALANCER_EOL_STATUS[ovhSubsidiary] ?? LOAD_BALANCER_EOL_STATUS.DEFAULT;

  return (
    <Message color={MESSAGE_COLOR.warning} dismissible={false} className="mb-6 mt-8">
      <MessageIcon name={ICON_NAME.triangleExclamation} />
      <MessageBody>
        <Trans
          ns={namespace}
          i18nKey={BANNER_I18N_KEY[namespace]}
          components={{
            eolLink: <Link href={statusLink} target="_blank" rel="noopener noreferrer" />,
            migrateLink: (
              <Link href={migrateDocumentationLink} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        />
      </MessageBody>
    </Message>
  );
}
