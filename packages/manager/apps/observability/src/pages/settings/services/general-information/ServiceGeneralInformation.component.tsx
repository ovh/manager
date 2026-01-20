import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItemProps, Clipboard, Tile, useFormatDate } from '@ovh-ux/muk';

import SkeletonWrapper from '@/components/dashboard/SkeletonWrapper.component';
import ResourceBadgeStatus from '@/components/services/status/ResourceBadgeStatus.component';
import { ServiceGeneralInformationProps } from '@/pages/settings/services/general-information/ServiceGeneralInformation.props';
import { urls } from '@/routes/Routes.constants';
import { LABELS } from '@/utils/labels.constants';

export const ServiceGeneralInformation = ({
  title,
  iam,
  createdAt,
  isLoading,
  resourceStatus,
}: ServiceGeneralInformationProps) => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.STATUS, NAMESPACES.ACTIONS]);
  const href = useHref(urls.deleteService);

  const formatDate = useFormatDate();

  const actionItems: ActionMenuItemProps[] = [
    {
      id: 1,
      label: t(`${NAMESPACES.ACTIONS}:terminate`),
      href,
      isDisabled: resourceStatus !== 'READY',
    },
  ];

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
            <Clipboard className="w-full" value={iam?.id} />
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
        <Tile.Item.Term
          label={t(`${NAMESPACES.STATUS}:status`)}
          actions={
            <ActionMenu
              id="status-action-menu"
              items={actionItems}
              isCompact
              variant={BUTTON_VARIANT.ghost}
            />
          }
        />
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
