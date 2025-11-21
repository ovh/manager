import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import {
  Notifications,
  RedirectionGuard,
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
            <OdsButton
              variant="ghost"
              icon="arrow-left"
              label={t('back_to_list', { ns: NAMESPACES.ACTIONS })}
            />
          </Link>
        </div>
        <OdsText preset={ODS_TEXT_PRESET.heading2}>
          {t('add_routing_headline')}
        </OdsText>
        <Notifications clearAfterRead />
        <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
          {t('add_routing_info')}
        </OdsMessage>

        <RuleForm onSubmit={onSubmit} ref={formRef} />
        <div className="flex flex-row justify-start gap-5 mt-4">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
            size="sm"
            onClick={() => {
              trackButtonClick(['create-rule', 'cancel']);
              navigate(urls.routing.listing);
            }}
          />
          <OdsButton
            variant={ODS_BUTTON_VARIANT.default}
            label={t('create', { ns: NAMESPACES.ACTIONS })}
            size="sm"
            onClick={() => {
              trackButtonClick(['create-rule', 'confirm']);
              formRef.current?.submit();
            }}
            isLoading={isCreatePending}
          />
        </div>
      </div>
    </RedirectionGuard>
  );
}
