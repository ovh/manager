import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actionsDeDE from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_de_DE.json';
import actionsEnGB from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_en_GB.json';
import actionsEsES from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_es_ES.json';
import actionsFrCA from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_CA.json';
import actionsFrFR from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import actionsItIT from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_it_IT.json';
import actionsPlPL from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_pl_PL.json';
import actionsPtPT from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_pt_PT.json';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { VAULT_SECRET_MASK } from '@/module.constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsDeDE from '../../../../../public/translations/vaults/Messages_de_DE.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsEnGB from '../../../../../public/translations/vaults/Messages_en_GB.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsEsES from '../../../../../public/translations/vaults/Messages_es_ES.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsFrCA from '../../../../../public/translations/vaults/Messages_fr_CA.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsFrFR from '../../../../../public/translations/vaults/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsItIT from '../../../../../public/translations/vaults/Messages_it_IT.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsPlPL from '../../../../../public/translations/vaults/Messages_pl_PL.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultsPtPT from '../../../../../public/translations/vaults/Messages_pt_PT.json';
import { VaultSecretField } from './VaultSecretField.component';

type VaultsMessages = {
  credentials: {
    hide: string;
    a11y: { show_secret: string; hide_secret: string; value_hidden: string };
  };
};

type ActionsMessages = { display: string };

const SECRET_VALUE = 's3cr3t-key';

/**
 * Every shipped locale, because the two strings the toggle shows come from two owners: the visible
 * label from the shared `actions` namespace, the extra context from this module. A translation pass
 * that makes them disagree may not cost the control its accessible name (WCAG 2.1 SC 2.5.3).
 */
const locales: [string, VaultsMessages, ActionsMessages][] = [
  ['de_DE', vaultsDeDE, actionsDeDE],
  ['en_GB', vaultsEnGB, actionsEnGB],
  ['es_ES', vaultsEsES, actionsEsES],
  ['fr_CA', vaultsFrCA, actionsFrCA],
  ['fr_FR', vaultsFrFR, actionsFrFR],
  ['it_IT', vaultsItIT, actionsItIT],
  ['pl_PL', vaultsPlPL, actionsPlPL],
  ['pt_PT', vaultsPtPT, actionsPtPT],
];

const renderSecretField = async (
  locale: string,
  vaults: VaultsMessages,
  actions: ActionsMessages,
) => {
  const i18n = createInstance();

  await i18n.init({
    lng: locale,
    supportedLngs: [locale],
    resources: {
      [locale]: { [BACKUP_LICENSES_NAMESPACES.VAULTS]: vaults, [NAMESPACES.ACTIONS]: actions },
    },
    interpolation: { escapeValue: false },
  });

  render(
    <I18nextProvider i18n={i18n}>
      <VaultSecretField label="Secret key" value={SECRET_VALUE} />
    </I18nextProvider>,
  );
};

describe('VaultSecretField', () => {
  it.each(locales)(
    'names the reveal toggle with the label it displays in %s',
    async (locale, vaults, actions) => {
      await renderSecretField(locale, vaults, actions);

      const showToggle = await screen.findByRole('button', { name: actions.display });
      expect(showToggle).toHaveAccessibleDescription(vaults.credentials.a11y.show_secret);

      fireEvent.click(showToggle);

      const hideToggle = screen.getByRole('button', { name: vaults.credentials.hide });
      expect(hideToggle).toHaveAccessibleDescription(vaults.credentials.a11y.hide_secret);
    },
  );

  it.each(locales)(
    'ships the mask its spoken equivalent in %s, and drops it once revealed',
    async (locale, vaults, actions) => {
      await renderSecretField(locale, vaults, actions);

      // The mask itself is hidden from the tree, so a locale missing this string would leave the
      // masked field announced as an unlabelled value.
      expect(await screen.findByText(vaults.credentials.a11y.value_hidden)).toBeInTheDocument();
      expect(screen.getByText(VAULT_SECRET_MASK)).toHaveAttribute('aria-hidden', 'true');

      fireEvent.click(screen.getByRole('button', { name: actions.display }));

      expect(screen.queryByText(vaults.credentials.a11y.value_hidden)).not.toBeInTheDocument();
      expect(screen.getByText(SECRET_VALUE)).toBeVisible();
    },
  );
});
