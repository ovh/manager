import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

import { labels } from '@/common/utils/tests/init.i18n';
import { testWrapperBuilder } from '@/common/utils/tests/testWrapperBuilder';
import { assertBadgeColor } from '@/common/utils/tests/uiTestHelpers';

import { VersionState } from './VersionStateBadge.component';

const renderVersionState = async (state: SecretVersionState) => {
  const wrapper = await testWrapperBuilder().withI18next().build();

  return render(<VersionState state={state} data-testid={VERSION_BADGE_TEST_ID} />, { wrapper });
};

describe('VersionState component test suite', () => {
  const useCases: {
    state: SecretVersionState;
    label: string;
    color: BadgeColor;
  }[] = [
    {
      state: 'ACTIVE',
      label: labels.secretManager.version_state_active,
      color: 'success',
    },
    {
      state: 'DEACTIVATED',
      label: labels.secretManager.version_state_deactivated,
      color: 'warning',
    },
    {
      state: 'DELETED',
      label: labels.secretManager.version_state_deleted,
      color: 'critical',
    },
  ];

  test.each(useCases)(
    'should return the right <Badge /> configuration for $state state',
    async ({ state, color: colorValue, label }) => {
      // when
      await renderVersionState(state);
      const component = screen.getByTestId(VERSION_BADGE_TEST_ID);

      // then
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent(label);
      assertBadgeColor(component, colorValue);
    },
  );
});
