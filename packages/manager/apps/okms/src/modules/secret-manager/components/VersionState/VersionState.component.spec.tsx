import { I18nextProvider } from 'react-i18next';
import { i18n } from 'i18next';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { initTestI18n, labels } from '@/utils/tests/init.i18n';
import { VersionState } from './VersionState.component';

let i18nValue: i18n;

const renderVersionState = async (state: SecretVersionState) => {
  if (!i18nValue) {
    i18nValue = await initTestI18n();
  }

  return render(
    <I18nextProvider i18n={i18nValue}>
      <VersionState state={state} />
    </I18nextProvider>,
  );
};

describe('VersionState test suite', () => {
  type TestCases = {
    state: SecretVersionState;
    label: string;
    color: ODS_BADGE_COLOR;
  };
  const testCases: TestCases[] = [
    {
      color: ODS_BADGE_COLOR.success,
      label: labels.secretManager.common.version_state_active,
      state: 'ACTIVE',
    },
    {
      color: ODS_BADGE_COLOR.warning,
      label: labels.secretManager.common.version_state_deactivated,
      state: 'DEACTIVATED',
    },
    {
      color: ODS_BADGE_COLOR.critical,
      label: labels.secretManager.common.version_state_deleted,
      state: 'DELETED',
    },
  ];

  it.each(testCases)(
    'should return odsBadge with label: $label and color: $color for version state: $state',
    async ({ state: version, color, label }) => {
      // given version

      // when
      await renderVersionState(version);

      // then
      const badge = screen.getByTestId(VERSION_BADGE_TEST_ID);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('label', label);
      expect(badge).toHaveAttribute('color', color);
    },
  );
});
