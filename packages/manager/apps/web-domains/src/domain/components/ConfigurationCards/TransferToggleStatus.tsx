import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import {
  Badge,
  Link,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';
import { TDomainResource } from '@/domain/types/domainResource';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { transferStatusFromState } from '@/domain/utils/transferStatus';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';

interface TransferToggleStatusProps {
  readonly domainResource: TDomainResource;
  readonly transferModalOpened: boolean;
  readonly setTransferModalOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly setTransferAuthInfoModalOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly setTagModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TransferToggleStatus({
  domainResource,
  transferModalOpened,
  setTransferModalOpened,
  setTransferAuthInfoModalOpened,
  setTagModalOpened,
}: TransferToggleStatusProps) {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.STATUS,
    NAMESPACES.SERVICE,
  ]);
  const transferStatus = transferStatusFromState(
    domainResource?.currentState?.protectionState,
    domainResource?.targetSpec?.protectionState,
  );
  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_transfer')}
        <CircleQuestionTooltip
          translatedMessage={t(transferStatus.i18nkeyTooltip)}
        />
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <Toggle
          withLabels={true}
          className="items-end"
          disabled={transferStatus.toggleStatus === 'disabled'}
          checked={
            domainResource?.currentState?.protectionState ===
            ProtectionStateEnum.PROTECTED
          }
          onCheckedChange={() => setTransferModalOpened(!transferModalOpened)}
          data-testid={'toggle'}
        >
          <ToggleControl data-testid={'toggle-control'} />
          <ToggleLabel>
            <Badge color={transferStatus.color}>
              {t(transferStatus.i18nkeyContent)}
            </Badge>
          </ToggleLabel>
        </Toggle>
        {!domainResource?.currentState?.authInfoSupported && (
          <Text>
            {t(
              'domain_tab_general_information_transfer_authinfo_not_supported',
            )}
          </Text>
        )}
        {domainResource?.currentState?.protectionState ===
          ProtectionStateEnum.UNPROTECTED &&
          domainResource?.currentState?.authInfoSupported && (
            <div>
              <Link onClick={() => setTransferAuthInfoModalOpened(true)}>
                {t('domain_tab_general_information_transfer_authinfo')}
              </Link>
            </div>
          )}
        {!domainResource?.currentState?.authInfoSupported && (
          <div>
            <Link onClick={() => setTagModalOpened(true)}>
              {t('domain_tab_general_information_transfer_tag')}
            </Link>
          </div>
        )}
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
