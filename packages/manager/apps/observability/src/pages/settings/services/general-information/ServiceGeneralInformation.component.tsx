import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Clipboard, Tile, useFormatDate } from '@ovh-ux/muk';

import SkeletonWrapper from '@/components/dashboard/SkeletonWrapper.component';
import ResourceBadgeStatus from '@/components/services/status/ResourceBadgeStatus.component';
import { ServiceGeneralInformationProps } from '@/pages/settings/services/general-information/ServiceGeneralInformation.props';
import { LABELS } from '@/utils/labels.constants';

export const ServiceGeneralInformation = ({
  title,
  resourceName,
  iam,
  createdAt,
  isLoading,
  resourceStatus,
}: ServiceGeneralInformationProps) => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.STATUS, 'services']);

  const formatDate = useFormatDate();

  return (
    <Tile.Root title={t(`${NAMESPACES.DASHBOARD}:general_information`)}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:name`)} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Text preset={TEXT_PRESET.span}>{title}</Text>
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={LABELS.ID} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Clipboard className="w-full" value={resourceName} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={LABELS.URN} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Clipboard className="w-full" value={iam?.urn} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.STATUS}:status`)} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <ResourceBadgeStatus status={resourceStatus} />
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t(`${NAMESPACES.DASHBOARD}:creation_date`)} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            {createdAt && (
              <Text preset={TEXT_PRESET.span}>{formatDate({ date: createdAt, format: 'P' })}</Text>
            )}
          </SkeletonWrapper>
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default ServiceGeneralInformation;
