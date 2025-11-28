import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsMessage,
  OdsPopover,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import clsx from 'clsx';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';
import { useOkmsById, useOkmsDatagridList } from '@/data/hooks/useOkms';
import { Link } from '@/common/components/Link/Link.component';

export default function DomainSelector() {
  const { t } = useTranslation(['secret-manager']);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const popoverRef = useRef<HTMLOdsPopoverElement>(null);
  const { okmsId } = useParams<LocationPathParams>();

  const {
    data: currentOkms,
    isPending: isOkmsPending,
    error: isOkmsError,
  } = useOkmsById(okmsId);

  const {
    data,
    error,
    isPending: isOkmsListPending,
    refetch,
  } = useOkmsDatagridList({
    pageSize: 100,
  });
  const flattenData = data?.pages.flatMap((page) => page.data);

  // Filter okms by regionId
  // const okmsList = flattenData
  //   ? filterOkmsListByRegion(flattenData, region)
  //   : [];

  const okmsList = flattenData;

  if (error) {
    return (
      <OdsMessage color="danger">
        isErrorResponse(error) ? error.response : {}
      </OdsMessage>
    );
  }

  if (isOkmsPending || isOkmsListPending) {
    return (
      <div className="flex items-center gap-2">
        <OdsText preset="heading-6">{t('domain')}</OdsText>
        <OdsSkeleton className="w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <OdsText preset="heading-6">{t('domain')}</OdsText>
      <div>
        <OdsButton
          icon="chevron-down"
          iconAlignment="right"
          id="trigger-domain-selector-popover"
          label={currentOkms?.data?.iam?.displayName || ''}
          variant="ghost"
          isLoading={isOkmsPending || isOkmsListPending}
        />
        <OdsPopover
          data-testid="region-selector-popover"
          ref={popoverRef}
          triggerId="trigger-domain-selector-popover"
          position="bottom-start"
          className="p-0 m-0"
        >
          <div className="flex flex-col gap-2 p-4">
            {okmsList.map((okms, index) => (
              <Link
                className={clsx(
                  'ml-1',
                  okms.id === okmsId
                    ? '[&::part(link)]:text-[var(--ods-color-heading)]'
                    : '[&::part(link)]:text-[var(--ods-color-primary-500)]',
                )}
                key={okms.id}
                label={okms.iam.displayName}
                isRouterLink
                onClick={() => {
                  popoverRef.current?.hide();
                  navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okms.id));
                }}
                href={null}
              />
            ))}
          </div>
        </OdsPopover>
      </div>
      <OdsButton
        label={t('okms_manage_label')}
        variant="outline"
        onClick={() =>
          navigate(SECRET_MANAGER_ROUTES_URLS.okmsDashboard(okmsId))
        }
      />
      <OdsButton
        label="Nouveau domaine OKMS"
        variant="outline"
        onClick={() => navigate(SECRET_MANAGER_ROUTES_URLS.addDomain(okmsId))}
      />
    </div>
  );
}
