import { Button, Icon, Message, MessageBody, MessageIcon, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { RedirectionGuard } from '@ovh-ux/muk';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import RuleForm from '@/components/routing/ruleForm/RuleForm.component';
import { urls } from '@/routes/routes.constant';
import { useCreateRouting } from '@/data/hooks/useNotificationRouting/useNotificationRouting';
import { CreateRouting } from '@/data/types/routing.type';
import { useAuthorization } from '@/hooks';
import useTracking from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

export default function CreateSettingsPage() {
  const formRef = useRef<{ submit: () => void }>(null);
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS, 'common']);
  const navigate = useNavigate();
  const { trackClick, trackErrorBanner, trackInfoBanner } = useTracking();
  const { addSuccess, clearNotifications, addError } = useNotifications();
  const { isAuthorized, isLoading } = useAuthorization([
    'account:apiovh:notification/routing/create',
  ]);

  const trackButtonClick = (actions: string[]) =>
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions,
      subApp: TrackingSubApps.Settings,
    });

  const {
    mutate: createRouting,
    isPending: isCreatePending,
  } = useCreateRouting({
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('add_routing_success_message'));
      trackInfoBanner({
        pageName: `create_rule_success_${t('add_routing_success_message')}`,
        subApp: TrackingSubApps.Settings,
      });
      navigate(urls.routing.listing);
    },
    onError: () => {
      clearNotifications();
      addError(t('add_routing_error_message'));
      trackErrorBanner({
        pageName: `create_rule_error_${t('add_routing_error_message')}`,
        subApp: TrackingSubApps.Settings,
      });
    },
  });

  useEffect(() => {
    clearNotifications();
  }, []);

  const onSubmit = (data: CreateRouting) => createRouting(data);
  return (
    <RedirectionGuard
      route={urls.routing.listing}
      isLoading={isLoading}
      condition={!isAuthorized}
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex flex-row justify-start gap-5">
          <Link
            to={urls.routing.listing}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.link,
                actionType: 'navigation',
                actions: ['go-back-listing-rules-parameter'],
                subApp: TrackingSubApps.Settings,
              });
            }}
          >
            <Button variant="ghost">
              <Icon name="arrow-left" />
              {t('back_to_list', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </Link>
        </div>
        <Text preset={TEXT_PRESET.heading2}>
          {t('add_routing_headline')}
        </Text>
        <Notifications clearAfterRead />
        <Message color="information" dismissible={false}>
          <MessageIcon name="circle-info" />
          <MessageBody>
            {t('add_routing_info')}
          </MessageBody>
        </Message>

        <RuleForm onSubmit={onSubmit} ref={formRef} />
        <div className="flex flex-row justify-start gap-5 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              trackButtonClick(['create-rule', 'cancel']);
              navigate(urls.routing.listing);
            }}
          >
            {t('cancel', { ns: NAMESPACES.ACTIONS })}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              trackButtonClick(['create-rule', 'confirm']);
              formRef.current?.submit();
            }}
            loading={isCreatePending}
          >
            {t('create', { ns: NAMESPACES.ACTIONS })}
          </Button>
        </div>
      </div>
    </RedirectionGuard>
  );
}
