/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */
import { useSecretVersionWithData } from '@secret-manager/data/hooks/useSecretVersion';
import { SecretData, SecretVersion } from '@secret-manager/types/secret.type';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';
import { createErrorResponseMock } from '@/common/utils/tests/testUtils';

import { SecretValue } from './SecretValue.component';
import { SECRET_RAW_VALUE_TEST_ID } from './secretValueRaw.constants';
import { SECRET_VALUE_TOGGLE_TEST_IDS } from './secretValueToggle.constants';

const errorLabels = allLabels.common.error;

// Mock the hook
vi.mock('@secret-manager/data/hooks/useSecretVersion');
const mockUseSecretVersionWithData = vi.mocked(useSecretVersionWithData);

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', async () => {
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsSpinner: vi.fn(() => <div data-testid="ods-spinner">Loading...</div>),
  };
});

// Mock child components
vi.mock('./SecretValueClipboards.component', () => ({
  SecretValueClipboards: vi.fn(() => (
    <div data-testid="secret-value-clipboards">Clipboards Component</div>
  )),
}));

const mockProps = {
  okmsId: 'test-okms-id',
  secretPath: 'test/secret/path',
  version: {
    id: 1,
    state: 'ACTIVE',
    createdAt: '2024-01-01',
  } as SecretVersion,
};

const mockKeyValueData: SecretData = {
  key1: 'value1',
  key2: 'value2',
};

const mockInvalidData: SecretData = {
  nested: { object: 'value' },
};

const renderTest = async (props = mockProps) => {
  return renderWithI18n(<SecretValue {...props} />);
};

describe('SecretValue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    test('should display spinner when isPending is true', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.toggle)).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    test('should display error message when hook returns error', async () => {
      // Given
      const fetchErrorMessage = 'Failed to fetch secret';
      const mockError = createErrorResponseMock(fetchErrorMessage);
      mockUseSecretVersionWithData.mockReturnValue({
        data: undefined,
        isPending: false,
        error: mockError,
      } as any);

      // When
      await renderTest();

      // Then
      await waitFor(() => {
        expect(
          screen.getByText(errorLabels.error_message.replace('{{message}}', fetchErrorMessage)),
        ).toBeInTheDocument();
      });
      expect(screen.queryByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.toggle)).not.toBeInTheDocument();
    });
  });

  describe('Success state with key-value data', () => {
    test('should render SecretValueContent with key-value data', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: { id: 1, data: mockKeyValueData, state: 'ACTIVE', createdAt: '2024-01-01' },
        isPending: false,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.toggle)).toBeInTheDocument();
      expect(screen.queryByTestId('ods-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('ods-message')).not.toBeInTheDocument();
    });

    test('should initialize toggle state as key-value for valid key-value objects', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: { id: 1, data: mockKeyValueData, state: 'ACTIVE', createdAt: '2024-01-01' },
        isPending: false,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId('secret-value-clipboards')).toBeInTheDocument();
      expect(screen.queryByTestId(SECRET_RAW_VALUE_TEST_ID)).not.toBeInTheDocument();
    });
  });

  describe('Success state with invalid data', () => {
    test('should initialize toggle state as json for non-key-value data', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: { id: 1, data: mockInvalidData, state: 'ACTIVE', createdAt: '2024-01-01' },
        isPending: false,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId(SECRET_RAW_VALUE_TEST_ID)).toBeInTheDocument();
      expect(screen.queryByTestId('secret-value-clipboards')).not.toBeInTheDocument();
    });
  });

  describe('Toggle functionality', () => {
    test('should render SecretValueClipboards when toggle is key-value', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: { id: 1, data: mockKeyValueData, state: 'ACTIVE', createdAt: '2024-01-01' },
        isPending: false,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId('secret-value-clipboards')).toBeInTheDocument();
    });

    test('should render SecretValueRaw when toggle is json for invalid data', async () => {
      // Given
      mockUseSecretVersionWithData.mockReturnValue({
        data: { id: 1, data: mockInvalidData, state: 'ACTIVE', createdAt: '2024-01-01' },
        isPending: false,
        error: null,
      } as any);

      // When
      await renderTest();

      // Then
      expect(screen.getByTestId(SECRET_RAW_VALUE_TEST_ID)).toBeInTheDocument();
    });
  });
});
