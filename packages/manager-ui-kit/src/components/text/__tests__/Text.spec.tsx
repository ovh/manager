import { screen } from '@testing-library/react';
import type { MockInstance } from 'vitest';
import { vitest } from 'vitest';

import { Text } from '@/components';
import { useAuthorizationIam } from '@/hooks';
import { render } from '@/setupTest';

import fr_FR from '../translations/Messages_fr_FR.json';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as MockInstance;

describe('Text tests', () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  describe('should display manager text', () => {
    it('with true value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: true,
        isLoading: true,
        isFetched: true,
      });
      render(
        <Text
          urn="urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd"
          iamActions={['manager-react-components:apiovh:manager-react-components/get-display']}
        >
          <div>foo-manager-text</div>
        </Text>,
      );
      expect(screen.getAllByText('foo-manager-text')).not.toBeNull();
    });
  });
  describe('should display error manager text', () => {
    it('with false value for useAuthorizationIam', () => {
      mockedHook.mockReturnValue({
        isAuthorized: false,
        isLoading: true,
        isFetched: true,
      });
      render(
        <Text
          urn="urn:v9:eu:resource:manager-react-components:vrz-a878-dsflkds-fdsfsd"
          iamActions={['manager-react-components:apiovh:manager-react-components/get-display']}
        >
          <div>foo-manager-text</div>
        </Text>,
      );
      expect(screen.findByText(fr_FR.iam_hidden_text)).not.toBeNull();
    });
  });
});
