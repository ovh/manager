import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  Notifications,
  RedirectionGuard,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { useNotificationRouting } from '@/data';
import RuleForm from '@/components/routing/ruleForm/RuleForm.component';
import { useUpdateRouting } from '@/data/hooks/useNotificationRouting/useNotificationRouting';
import { CreateRouting } from '@/data/types/routing.type';
import { useAuthorization } from '@/hooks';
import useTracking from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

export default function EditSettingsPage() {
  const formRef = useRef<{ submit: () => void }>(null);
  const { t } = useTranslation(['settings', NAMESPACES.ACTIONS, 'common']);
  const { routingId } = useParams();
  const { trackClick, trackErrorBanner, trackInfoBanner } = useTracking();
  const navigate = useNavigate();
  const { addSuccess, clearNotifications, addError } = useNotifications();
  const { isAuthorized, isLoading: isLoadingAuthorization } = useAuthorization([
    'account:apiovh:notification/routing/get',
    'account:apiovh:notification/routing/edit',
  ]);

  const trackButtonClick = (actions: string[]) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions,
      subApp: TrackingSubApps.Settings,
    });

  const { data: routing, isLoading: isLoadingRouting } = useNotificationRouting(
    {
      routingId: routingId as string,
      enabled: isAuthorized,
    },
  );
  const {
    mutate: updateRouting,
    isPending: isUpdatePending,
  } = useUpdateRouting({
    routingId: routingId as string,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('edit_routing_success_message'));
      trackInfoBanner({
        pageName: `modify_rule_success_${t('edit_routing_success_message')}`,
        subApp: TrackingSubApps.Settings,
      });
      navigate(urls.routing.listing);
    },
    onError: () => {
      clearNotifications();
      addError(t('edit_routing_error_message'));
      trackErrorBanner({
        pageName: `modify_rule_error_${t('edit_routing_error_message')}`,
        subApp: TrackingSubApps.Settings,
      });
    },
  });

  useEffect(() => {
    clearNotifications();
  }, []);

  const isLoading = isLoadingRouting || isLoadingAuthorization;

  const onSubmit = (data: CreateRouting) => updateRouting(data);
  return (
    <RedirectionGuard
      route={urls.routing.listing}
      isLoading={isLoading}
      condition={!isAuthorized}
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex flex-row justify-start gap-5">
          <Link to={urls.routing.listing}>
            <OdsButton
              variant="ghost"
              icon="arrow-left"
              label={t('back_to_list', { ns: NAMESPACES.ACTIONS })}
            />
          </Link>
        </div>
        <OdsText preset={ODS_TEXT_PRESET.heading2}>
          {t('edit_routing_headline')}
        </OdsText>
        <Notifications clearAfterRead />
        <RuleForm rule={routing} onSubmit={onSubmit} ref={formRef} />
        <div className="flex flex-row justify-start gap-5 mt-4">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
            size="sm"
            onClick={() => {
              trackButtonClick(['modify_rule', 'cancel']);
              navigate(urls.routing.listing);
            }}
          />
          <OdsButton
            variant={ODS_BUTTON_VARIANT.default}
            label={t('save', { ns: NAMESPACES.ACTIONS })}
            size="sm"
            onClick={() => {
              trackButtonClick(['modify_rule', 'confirm']);
              formRef.current?.submit();
            }}
            isLoading={isUpdatePending}
          />
        </div>
      </div>
    </RedirectionGuard>
  );
}
