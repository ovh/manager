import React, { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_POPOVER_POSITION,
} from '@ovhcloud/ods-components';
import { OdsPopover } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, ManagerButton } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { ActionButton } from '@/components/ActionButton/ActionButton.component';
import {
  selectCanTerminateVault,
  selectVaultCredentialsBucket,
} from '@/data/selectors/vaults.selectors';
import { useReturnFocus } from '@/hooks/useReturnFocus/useReturnFocus';
import { useTerminateIamActions } from '@/hooks/useTerminateIamActions/useTerminateIamActions';
import { getTerminateVaultUrl, getVaultCredentialsUrl } from '@/routes/routes.constants';
import { VaultResource } from '@/types/Vault.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';

import { getVaultActionsMenuId, getVaultActionsTriggerId } from '../vaults.constants';
import { VaultDisabledAction } from './VaultDisabledAction.component';

export type VaultActionsCellProps = {
  vault: VaultResource;
};

export const VaultActionsCell = ({ vault }: VaultActionsCellProps) => {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const [isMenuTriggered, setIsMenuTriggered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const popoverRef = useRef<HTMLOdsPopoverElement>(null);
  const terminateIamActions = useTerminateIamActions();

  const triggerId = getVaultActionsTriggerId(vault.id);
  const menuId = getVaultActionsMenuId(vault.id);
  const returnFocusToTrigger = useReturnFocus(triggerId);

  /**
   * `OdsPopover.hide()` only hides its host, so the focused entry leaves the accessibility tree and
   * focus lands on `<body>` — a keyboard user would have to tab from the top of the page again. Focus
   * is only taken back when it went down with the menu: an outside click has already moved it
   * somewhere the customer chose.
   */
  const handleMenuHidden = () => {
    setIsMenuOpen(false);
    const focused = document.activeElement;
    if (!focused || focused === document.body || popoverRef.current?.contains(focused)) {
      returnFocusToTrigger();
    }
  };

  /**
   * `displayTooltip: false` mirrors MRC's own `ActionMenu`: its default wraps an unauthorized entry in
   * an extra `w-fit` div (defeating `w-full`) and mounts a "you lack the permission" tooltip in the DOM
   * before the menu is ever opened. `ActionMenu` itself is not reused because it offers no per-item
   * tooltip for the disabled-BUNDLE case, and names its icon-only trigger with an `aria-label` the ODS
   * shadow root never exposes (see ActionButton).
   */
  const menuItemProps = {
    size: ODS_BUTTON_SIZE.sm,
    variant: ODS_BUTTON_VARIANT.ghost,
    displayTooltip: false,
    className: 'w-full',
  };
  const credentialsLabel = t('action.show_credentials');
  const terminateLabel = t(`${NAMESPACES.ACTIONS}:terminate`);

  /**
   * `iam` is nullable on `backup.tenant.vaultWithIAM`, and `ManagerButton` renders an ungated, enabled
   * button when it gets no URN (`isAuthorized || !(iamActions && urn)`). Without an envelope there is
   * nothing to check the actions against, so the entries fail closed rather than open.
   */
  const iamUrn = vault.iam?.urn;

  return (
    <DataGridTextCell>
      <ActionButton
        id={triggerId}
        testId={triggerId}
        icon={ODS_ICON_NAME.ellipsisVertical}
        accessibleName={t('action.menu_label')}
        disclosedOverlayId={menuId}
        isExpanded={isMenuOpen}
        popupRole="menu"
        onClick={() => setIsMenuTriggered(true)}
      />
      <OdsPopover
        ref={popoverRef}
        id={menuId}
        triggerId={triggerId}
        position={ODS_POPOVER_POSITION.bottomEnd}
        withArrow
        className="py-2 px-0 w-max"
        onOdsShow={() => setIsMenuOpen(true)}
        onOdsHide={handleMenuHidden}
      >
        {/* DEFERRED: no menu/menuitem roles nor arrow-key roving — the focusable node of an ODS 18
            entry lives in a shadow root this component cannot reach or re-role. Tab moves between
            the two entries in DOM order, Enter/Space opens and Escape closes (ux.md § Accessibility). */}
        <div className="flex flex-col">
          {selectVaultCredentialsBucket(vault) ? (
            <ManagerButton
              {...menuItemProps}
              id={`vault-credentials-${vault.id}`}
              data-testid={`vault-credentials-${vault.id}`}
              iamActions={[IAM_ACTIONS.vaultCredentialsGet]}
              urn={iamUrn}
              isDisabled={!iamUrn}
              isIamTrigger={isMenuTriggered}
              label={credentialsLabel}
              onClick={() => navigate(getVaultCredentialsUrl(vault.id))}
            />
          ) : (
            <VaultDisabledAction
              id={`vault-credentials-disabled-${vault.id}`}
              tooltipId={`vault-credentials-tooltip-${vault.id}`}
              testId={`vault-credentials-disabled-${vault.id}`}
              label={credentialsLabel}
              tooltip={t('action.credentials_disabled_tooltip')}
            />
          )}
          {selectCanTerminateVault(vault) ? (
            <ManagerButton
              {...menuItemProps}
              id={`vault-terminate-${vault.id}`}
              data-testid={`vault-terminate-${vault.id}`}
              iamActions={terminateIamActions}
              urn={iamUrn}
              isDisabled={!iamUrn}
              isIamTrigger={isMenuTriggered}
              label={terminateLabel}
              onClick={() => navigate(getTerminateVaultUrl(vault.id))}
            />
          ) : (
            <VaultDisabledAction
              id={`vault-terminate-disabled-${vault.id}`}
              tooltipId={`vault-terminate-tooltip-${vault.id}`}
              testId={`vault-terminate-disabled-${vault.id}`}
              label={terminateLabel}
              tooltip={t('terminate.included_tooltip')}
            />
          )}
        </div>
      </OdsPopover>
    </DataGridTextCell>
  );
};
