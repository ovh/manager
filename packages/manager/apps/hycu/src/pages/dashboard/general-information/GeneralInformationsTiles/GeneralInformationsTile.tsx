import {
  Badge,
  BADGE_SIZE,
  Icon,
  ICON_NAME,
  Skeleton,
} from '@ovhcloud/ods-react';
import {
  Tile,
  Text,
  Button,
  Link,
  TEXT_PRESET,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@ovh-ux/muk';
import { useServiceDetails } from '@ovh-ux/manager-module-common-api';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getStatusColor } from '@/utils/statusColor';
import {
  useDetailsLicenseHYCU,
  useDownloadLicenseHYCUMutation,
} from '@/hooks/api/license';
import { LicenseStatus } from '@/types/hycu.details.interface';
import { subRoutes, urls } from '@/routes/routes.constant';
import { IAM_ACTIONS } from '@/utils/iam.constants';

const ActivateHycuLicense = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation('hycu/dashboard');
  const { data: hycuDetail, isLoading } = useDetailsLicenseHYCU(serviceName);
  const { mutate } = useDownloadLicenseHYCUMutation();

  if (isLoading) return <Skeleton />;
  if (LicenseStatus.ACTIVATED !== hycuDetail?.data.licenseStatus)
    return <Text disabled>{t('hycu_dashboard_wait_for_activation')}</Text>;
  return (
    <Link
      data-testid="dashboard-license-download-link"
      urn={hycuDetail.data.iam.urn}
      iamActions={[IAM_ACTIONS.licenseHycuApiOvhGet]}
      onClick={() => {
        mutate({ serviceName });
      }}
    >
      <>
        {t('hycu_dashboard_download_license_file')}
        <Icon
          className="ml-3"
          name={ICON_NAME.download}
          aria-hidden="true"
        ></Icon>
      </>
    </Link>
  );
};

const ControllerIdHycuLicense = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation('hycu/dashboard');
  const { data: hycuDetail, isLoading } = useDetailsLicenseHYCU(serviceName);

  if (isLoading) return <Skeleton />;
  if (!hycuDetail?.data.controllerId)
    return <Text disabled>{t('hycu_dashboard_wait_for_activation')}</Text>;
  return (
    <Text className="block" preset={TEXT_PRESET.span}>
      {hycuDetail?.data.controllerId}
    </Text>
  );
};

const GeneralInformationsTile = ({ serviceName }: { serviceName: string }) => {
  const { t } = useTranslation([
    'hycu',
    'hycu/dashboard',
    NAMESPACES.DASHBOARD,
    NAMESPACES.STATUS,
  ]);
  const navigate = useNavigate();
  const {
    data: hycuDetail,
    isLoading: isLoadingLicence,
  } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });
  const openEditNameModal = () =>
    navigate(urls.editName.replace(subRoutes.serviceName, serviceName));

  return (
    <Tile.Root title={t(`${NAMESPACES.DASHBOARD}:general_information`)}>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t(`${NAMESPACES.DASHBOARD}:name`)}
        ></Tile.Item.Term>
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            <div className="flex items-center space-between gap-x-2">
              <Text className="block grow" preset={TEXT_PRESET.span}>
                {serviceDetails?.data.resource.displayName}
              </Text>

              <Button
                disabled={
                  serviceDetails?.data.resource.state === 'suspended' ||
                  undefined
                }
                data-testid="edit-hycu-displayname-action"
                className="min-w-10"
                variant={BUTTON_VARIANT.ghost}
                color={BUTTON_COLOR.primary}
                size={BUTTON_SIZE.sm}
                onClick={openEditNameModal}
              >
                <Icon
                  aria-label="edit"
                  name={ICON_NAME.pen}
                  aria-hidden="true"
                />
              </Button>
            </div>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t(`${NAMESPACES.STATUS}:status`)}
        ></Tile.Item.Term>
        <Tile.Item.Description>
          {isLoadingLicence ? (
            <Skeleton />
          ) : (
            <Badge
              color={getStatusColor(hycuDetail?.data.licenseStatus)}
              size={BADGE_SIZE.sm}
            >
              {t([
                `hycu:hycu_status_${hycuDetail?.data.licenseStatus}`,
                'hycu:hycu_status_error',
              ])}
            </Badge>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('hycu/dashboard:hycu_dashboard_label_pack_type')}
        ></Tile.Item.Term>
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text className="block" preset={TEXT_PRESET.span}>
              {serviceDetails?.data.resource.product.description}
            </Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('hycu/dashboard:hycu_dashboard_label_controller_id')}
        ></Tile.Item.Term>
        <Tile.Item.Description>
          {ControllerIdHycuLicense({ serviceName })}
        </Tile.Item.Description>
      </Tile.Item.Root>
      <Tile.Item.Root>
        <Tile.Item.Term
          label={t('hycu/dashboard:hycu_dashboard_label_license_key')}
        ></Tile.Item.Term>
        <Tile.Item.Description divider={false}>
          {isLoading ? (
            <Skeleton />
          ) : (
            <ActivateHycuLicense
              serviceName={serviceName}
            ></ActivateHycuLicense>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default GeneralInformationsTile;
