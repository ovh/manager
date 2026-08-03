import React from 'react';

import { render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

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
import { VaultCredentialField } from './VaultCredentialField.component';

type VaultsMessages = {
  credentials: { field: { endpoint: string }; a11y: { copy_field: string } };
};

const locales: [string, VaultsMessages][] = [
  ['de_DE', vaultsDeDE],
  ['en_GB', vaultsEnGB],
  ['es_ES', vaultsEsES],
  ['fr_CA', vaultsFrCA],
  ['fr_FR', vaultsFrFR],
  ['it_IT', vaultsItIT],
  ['pl_PL', vaultsPlPL],
  ['pt_PT', vaultsPtPT],
];

/**
 * Escaping stays at its production default here — the app's `initI18n` never turns it off, it only
 * post-processes `&amp;` — because the field label is interpolated into the copy control's accessible
 * name and half the shipped labels carry an apostrophe ("Point d'accès S3"). Un-escaped values are
 * the only reason a screen reader does not read out "d&#39;accès" (ux.md § Accessibility).
 */
const renderCredentialField = async (locale: string, vaults: VaultsMessages) => {
  const i18n = createInstance();

  await i18n
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
    })
    .init({
      lng: locale,
      supportedLngs: [locale],
      postProcess: 'normalize',
      resources: { [locale]: { [BACKUP_LICENSES_NAMESPACES.VAULTS]: vaults } },
    });

  render(
    <I18nextProvider i18n={i18n}>
      <VaultCredentialField
        label={vaults.credentials.field.endpoint}
        value="s3.eu-west-rbx.io.cloud.ovh.net"
        testId="vault-credentials-endpoint"
      />
    </I18nextProvider>,
  );
};

describe('VaultCredentialField', () => {
  it.each(locales)('names the copy control after its field in %s', async (locale, vaults) => {
    await renderCredentialField(locale, vaults);

    const expectedName = vaults.credentials.a11y.copy_field.replace(
      '{{field}}',
      vaults.credentials.field.endpoint,
    );
    const copyButton = await screen.findByTestId('vault-credentials-endpoint-copy');

    expect(copyButton).toHaveAccessibleName(expectedName);
    expect(copyButton.getAttribute('aria-label')).not.toMatch(/&(#\d+|[a-z]+);/);
  });
});
