import { SecretData } from '@secret-manager/types/secret.type';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { labels as allLabels } from '@/common/utils/tests/init.i18n';
import { renderWithI18n } from '@/common/utils/tests/testUtils';

import { SecretValueClipboards } from './SecretValueClipboards.component';
import { KEY_VALUES_TEST_IDS } from './secretValueClipboards.constants';

const labels = allLabels.secretManager;

const mockData = {
  validSingle: {
    key1: 'value1',
  },
  validMultiple: {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  },
  invalid: {
    key: { nested: 'object' },
  },
};

// Mocking ODS components
vi.mock('@ovhcloud/ods-components/react', async () => {
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsClipboard: vi.fn(({ value }: { value: string }) => (
      <div data-testid="ods-clipboard">{value}</div>
    )),
    OdsFormField: vi.fn(
      ({
        children,
        className,
        'data-testid': dataTestId,
      }: {
        children: React.ReactNode;
        className?: string;
        'data-testid'?: string;
      }) => (
        <div className={className} data-testid={dataTestId}>
          {children}
        </div>
      ),
    ),
  };
});

const renderTest = async (data: SecretData) => {
  return renderWithI18n(<SecretValueClipboards data={data} />);
};

describe('SecretValueClipboards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering clipboards', () => {
    test('should render labels correctly', async () => {
      // Given

      // When
      await renderTest(mockData.validMultiple);

      // Then
      const keyLabels = screen.getAllByText(labels.key);
      const valueLabels = screen.getAllByText(labels.value);
      expect(keyLabels).toHaveLength(3);
      expect(valueLabels).toHaveLength(3);
    });

    test('should handle single key-value pair', async () => {
      // Given

      // When
      await renderTest(mockData.validSingle);

      // Then
      expect(screen.getByTestId(KEY_VALUES_TEST_IDS.pairItem(0))).toBeInTheDocument();
      expect(screen.queryByTestId(KEY_VALUES_TEST_IDS.pairItem(1))).not.toBeInTheDocument();
    });

    test('should render multiple key-value pairs correctly', async () => {
      // Given

      // When
      await renderTest(mockData.validMultiple);

      // Then
      const clipboards = screen.getAllByTestId('ods-clipboard');
      expect(clipboards).toHaveLength(6); // 3 pairs × 2 (key + value)

      expect(screen.getByTestId(KEY_VALUES_TEST_IDS.pairItem(0))).toBeInTheDocument();
      expect(screen.getByTestId(KEY_VALUES_TEST_IDS.pairItem(1))).toBeInTheDocument();
      expect(screen.getByTestId(KEY_VALUES_TEST_IDS.pairItem(2))).toBeInTheDocument();
      expect(screen.queryByTestId(KEY_VALUES_TEST_IDS.pairItem(3))).not.toBeInTheDocument();
    });

    test('should display correct values in clipboards', async () => {
      // Given

      // When
      await renderTest(mockData.validMultiple);

      // Then
      const clipboards = screen.getAllByTestId('ods-clipboard');
      const mockedKeys = Object.keys(mockData.validMultiple);
      expect(clipboards[0]).toHaveTextContent(mockedKeys[0] as string);
      expect(clipboards[1]).toHaveTextContent(mockData.validMultiple.key1);
      expect(clipboards[2]).toHaveTextContent(mockedKeys[1] as string);
      expect(clipboards[3]).toHaveTextContent(mockData.validMultiple.key2);
      expect(clipboards[4]).toHaveTextContent(mockedKeys[2] as string);
      expect(clipboards[5]).toHaveTextContent(mockData.validMultiple.key3);
    });
  });

  describe('Error handling', () => {
    test('should show error message for invalid objects', async () => {
      // Given

      // When
      await renderTest(mockData.invalid);

      // Then
      await waitFor(() => {
        expect(screen.getByText(labels.error_key_value_conversion)).toBeInTheDocument();
      });
    });
  });
});
