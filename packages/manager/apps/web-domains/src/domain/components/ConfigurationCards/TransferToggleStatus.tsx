import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Badge,
  BADGE_COLOR,
  Icon,
  ICON_NAME,
  Link,
  Toggle,
  ToggleControl,
  ToggleLabel,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { TDomainResource } from '@/domain/types/domainResource';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { transferStatusFromState } from '@/domain/utils/transferStatus';

interface TransferToggleStatusProps {
  readonly domainResource: TDomainResource;
  readonly transferModalOpened: boolean;
  readonly setTransferModalOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly transferAuthInfoModalOpened: boolean;
  readonly setTransferAuthInfoModalOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function TransferToggleStatus({
  domainResource,
  transferModalOpened,
  setTransferModalOpened,
  transferAuthInfoModalOpened,
  setTransferAuthInfoModalOpened,
}: TransferToggleStatusProps) {
  const { t } = useTranslation(['domain', NAMESPACES.STATUS]);
  const transferStatus = transferStatusFromState(
    domainResource.currentState.protectionState,
    ProtectionStateEnum.PROTECTED,
  );
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_transfer')}
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon className="pl-3" name={ICON_NAME.circleQuestion} />
          </TooltipTrigger>
          <TooltipContent>{t(transferStatus.i18nkeyTooltip)}</TooltipContent>
        </Tooltip>
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <Toggle
          withLabels={true}
          className="items-end"
          disabled={transferStatus.toggleStatus === 'disabled'}
          checked={
            domainResource.currentState.protectionState ===
            ProtectionStateEnum.PROTECTED
          }
          onCheckedChange={() => setTransferModalOpened(!transferModalOpened)}
          data-testid={'toggle'}
        >
          <ToggleControl data-testid={'toggle-control'} />
          <ToggleLabel>
            <Badge color={transferStatus.color} className="mt-4">
              {t(transferStatus.i18nkeyContent)}
            </Badge>
          </ToggleLabel>
        </Toggle>
        {domainResource.currentState.protectionState ===
          ProtectionStateEnum.UNPROTECTED && (
          <div>
            <Link
              onClick={() =>
                setTransferAuthInfoModalOpened(!transferAuthInfoModalOpened)
              }
            >
              {t('domain_tab_general_information_transfer_authinfo')}
            </Link>
          </div>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
