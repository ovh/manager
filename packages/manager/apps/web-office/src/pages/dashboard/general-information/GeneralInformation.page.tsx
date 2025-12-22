import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  Icon,
  Skeleton,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, GridLayout, Tile } from '@ovh-ux/muk';

import { OfficeServiceState } from '@/components/office-service-state/OfficeServiceState.component';
import { LicenseEnum } from '@/data/api/ApiType';
import { useLicenseDetail } from '@/data/hooks/license-details/useLicenseDetails';
import { useParentTenant } from '@/data/hooks/parent-tenant/useParentTenant';
import { useServiceInfos } from '@/data/hooks/service-infos/useServiceInfos';
import { useUsers } from '@/data/hooks/users/useUsers';
import { useDateFnsLocale } from '@/hooks/date-fns-locale/useDateFnsLocale';
import { IAM_ACTIONS } from '@/utils/IamAction.constants';
import { ServiceType } from '@/utils/ServiceType.utils';

export default function GeneralInformation() {
  const { t } = useTranslation([
    'dashboard/general-information',
    'common',
    NAMESPACES.STATUS,
    NAMESPACES.DASHBOARD,
  ]);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const locale = useDateFnsLocale();
  const serviceType = ServiceType(serviceName);

  const { data: licenseDetail, isLoading: isLoadingLicenseDetail } = useLicenseDetail();
  const { data: serviceInfos, isLoading: isLoadingServiceInfos } = useServiceInfos();
  const { data: dataUsers, isLoading: isLoadingUsers } = useUsers();
  const { data: dataParentTenant, isLoading: isLoadingParentTenant } = useParentTenant();

  return (
    <GridLayout>
      <Tile.Root
        data-testid="general_informations"
        title={t(`${NAMESPACES.DASHBOARD}:general_information`)}
      >
        <Tile.Item.Root>
          <Tile.Item.Term label={t('common:displayName')} />
          <Tile.Item.Description>
            {!isLoadingParentTenant && (
              <div className="flex items-center justify-between gap-2">
                <Text preset={TEXT_PRESET.paragraph} className="break-all">
                  {dataParentTenant?.displayName}
                </Text>
                <div className="min-w-fit">
                  {licenseDetail && licenseDetail && (
                    <Button
                      id="edit-name"
                      size={BUTTON_SIZE.sm}
                      variant={BUTTON_VARIANT.ghost}
                      color={BUTTON_COLOR.primary}
                      onClick={() => navigate('./edit-name')}
                      urn={licenseDetail?.iam?.urn}
                      iamActions={[
                        ...(licenseDetail?.tenantServiceName
                          ? [IAM_ACTIONS.licencePrepaid.putParentTenant]
                          : [IAM_ACTIONS.licencePostPaid.edit]),
                      ]}
                    >
                      <Icon name={ICON_NAME.pen} />
                    </Button>
                  )}
                </div>
              </div>
            )}
            {isLoadingParentTenant && <Skeleton></Skeleton>}
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t('common:serviceName')} />
          <Tile.Item.Description>
            {!isLoadingParentTenant && (
              <Text preset={TEXT_PRESET.paragraph}>{dataParentTenant?.serviceName}</Text>
            )}
            {isLoadingParentTenant && <Skeleton></Skeleton>}
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:service_type`)} />
          <Tile.Item.Description divider={false}>
            {!isLoadingLicenseDetail && (
              <Text preset={TEXT_PRESET.paragraph}>{t(`common:${serviceType}`)}</Text>
            )}
            {isLoadingLicenseDetail && <Skeleton></Skeleton>}
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
      <Outlet />
      <Tile.Root data-testid="statistics" title={t(`${NAMESPACES.DASHBOARD}:statistics`)}>
        <Tile.Item.Root>
          <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:license_number`)} />
          <Tile.Item.Description divider={false}>
            {!isLoadingUsers &&
              dataUsers?.length > 0 &&
              dataUsers
                .reduce(
                  (accumulator: { licences: LicenseEnum; number: number }[], currentValue) => {
                    const findIndex = accumulator.findIndex(
                      (elm) => elm.licences === currentValue.licences[0],
                    );
                    if (findIndex === -1) {
                      accumulator.push({
                        licences: currentValue.licences[0],
                        number: 1,
                      });
                    } else {
                      accumulator[findIndex].number += 1;
                    }
                    return accumulator;
                  },
                  [],
                )
                ?.map((stats: { licences: LicenseEnum; number: number }) => (
                  <Text key={stats.licences} preset={TEXT_PRESET.paragraph}>
                    <strong>{stats.licences} : </strong>
                    {stats.number}
                  </Text>
                ))}
            {!isLoadingUsers && dataUsers?.length === 0 && (
              <Text preset={TEXT_PRESET.paragraph}>{t('common:noAccountOffer')}</Text>
            )}
            {isLoadingUsers && (
              <div className="flex flex-col gap-2">
                <Skeleton></Skeleton>
                <Skeleton></Skeleton>
              </div>
            )}
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
      <Tile.Root data-testid="my_offer" title={t(`${NAMESPACES.DASHBOARD}:my_offer`)}>
        <Tile.Item.Root>
          <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:creation_date`)} />
          <Tile.Item.Description>
            {!isLoadingServiceInfos && (
              <Text preset={TEXT_PRESET.paragraph}>
                {serviceInfos?.creation ? format(serviceInfos?.creation, 'PPP', { locale }) : ''}
              </Text>
            )}
            {isLoadingServiceInfos && <Skeleton></Skeleton>}
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={t(`${NAMESPACES.STATUS}:status`)} />
          <Tile.Item.Description divider={serviceType === 'prepaid'}>
            {!isLoadingServiceInfos && <OfficeServiceState state={serviceInfos?.status} />}
            {isLoadingServiceInfos && <Skeleton></Skeleton>}
          </Tile.Item.Description>
        </Tile.Item.Root>
        {serviceType === 'prepaid' && (
          <Tile.Item.Root>
            <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:renew_date`)} />
            <Tile.Item.Description divider={false}>
              {!isLoadingServiceInfos && (
                <Text preset={TEXT_PRESET.paragraph}>
                  {serviceInfos?.expiration
                    ? format(serviceInfos?.expiration, 'PPP', { locale })
                    : ''}
                </Text>
              )}
              {isLoadingServiceInfos && <Skeleton></Skeleton>}
            </Tile.Item.Description>
          </Tile.Item.Root>
        )}
      </Tile.Root>
    </GridLayout>
  );
}
