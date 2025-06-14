import React, { Suspense, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_DIVIDER_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ServiceAction,
  useServiceActions,
} from '@/billing/hooks/useServiceActions';
import { BillingService } from '@/billing/types/billingServices.type';
import { useServiceLinks } from '@/billing/hooks/useServiceLinks';
import { getPendingEngagement } from '@/data/api/billingServices';
import { SERVICE_TYPES_WITH_COMMITMENT } from '@/billing.constants';

type ServicesActionsProps = {
  service: BillingService;
  autoRenewLink: string;
  trackingPrefix: string[];
};

export default function ServicesActions({
  service: initialService,
  autoRenewLink,
  trackingPrefix,
}: ServicesActionsProps) {
  const [service, setService] = useState(initialService);

  const links = useServiceLinks(service, autoRenewLink);
  const items: ServiceAction[] = useServiceActions(
    service,
    links,
    trackingPrefix,
  );
  const shouldBeDisplayed =
    Boolean(autoRenewLink) ||
    service.canBeEngaged ||
    service.hasPendingEngagement;

  const onOpenPopOver = async () => {
    if (
      service.hasPendingEngagement === undefined &&
      SERVICE_TYPES_WITH_COMMITMENT.includes(service.serviceType)
    ) {
      const hasPendingEngagement = await getPendingEngagement(service.id);
      setService(
        new BillingService({
          ...service,
          hasPendingEngagement,
        }),
      );
    }
  };

  // When we'll migrate to ODS 18, we should try to have the popover "rounded" & "withArrow" and add a direction to it
  return shouldBeDisplayed ? (
    <OsdsPopover dir="rtl" onClick={onOpenPopOver}>
      <OsdsButton
        slot="popover-trigger"
        className="min-w-9"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        inline
        circle
      >
        <OsdsIcon
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xs}
          name={ODS_ICON_NAME.ELLIPSIS}
        />
      </OsdsButton>
      <OsdsPopoverContent>
        <Suspense
          fallback={
            <>
              <OsdsSkeleton />
              <OsdsSkeleton />
              <OsdsSkeleton />
              <OsdsSkeleton />
            </>
          }
        >
          {items.map((item, index) => {
            const { disabled, external, ...link } = item;
            return (
              <div
                className="text-left"
                key={`service_action_${service.domain}_${index}`}
              >
                {index > 0 && <OsdsDivider size={ODS_DIVIDER_SIZE.four} />}
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  {...link}
                  disabled={disabled || undefined}
                  dir="ltr"
                >
                  {item.label}
                  {external && (
                    <OsdsIcon
                      slot="end"
                      className="ml-4"
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    />
                  )}
                </OsdsLink>
              </div>
            );
          })}
        </Suspense>
      </OsdsPopoverContent>
    </OsdsPopover>
  ) : null;
}
