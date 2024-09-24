// versionSelector.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  QueryObserverBaseResult,
  QueryObserverSuccessResult,
} from '@tanstack/react-query';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useEffect, useState } from 'react';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import { VersionSelector } from './VersionSelector.component';
import { useGetCloudSchema } from '@/api/hooks/useCloud';

const TestComponent = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    // Simuler une mise à jour de la version après un certain délai
    const timeout = setTimeout(() => {
      setVersion('2.0.0');
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <VersionSelector onSelectVersion={setVersion} versionSelected={version} />
  );
};

vi.mock('@/api/hooks/useCloud', () => ({
  useGetCloudSchema: vi.fn(),
}));

const mockUseGetCloudSchema = useGetCloudSchema as any;

const initQuery = {
  data: {
    models: {
      'cloud.kube.VersionEnum': {
        enum: ['v1.21.0', 'v1.22.0', 'v1.23.0'],
      },
    },
  },
  isPending: false,
  isFetching: false,
  isError: false,
  isSuccess: true,
  status: 'success' as const,
  error: (undefined as unknown) as Error,
} as QueryObserverBaseResult | QueryObserverSuccessResult;

beforeEach(() => {
  mockUseGetCloudSchema.mockReturnValue(initQuery);
});

describe('VersionSelector', () => {
  it('should call onSelectVersion with the selected version', async () => {
    const onSelectVersion = vi.fn();
    render(
      <VersionSelector onSelectVersion={onSelectVersion} versionSelected="" />,
    );
    await waitFor(() => {
      expect(onSelectVersion).toHaveBeenCalledWith('v1.23.0');
    });
    //
  });
  it('renders without errors and selects last version by default', async () => {
    const { getByText } = render(<TestComponent />);
    expect(screen.getByTestId('version-selector-select')).toBeInTheDocument();
    const select = screen.getByTestId('version-selector-select');
    expect(select).toHaveValue('v1.23.0');
  });

  it('selects a version based on the versionSelected prop', () => {
    render(
      <VersionSelector onSelectVersion={vi.fn()} versionSelected="v1.22.0" />,
    );

    const select = screen.getByTestId('version-selector-select');
    expect(select).toHaveValue('v1.22.0');
  });

  // Test case to check if the onSelectVersion callback is called when a new version is selected
  it('calls onSelectVersion callback when a new version is selected', async () => {
    const onSelectVersionMock = vi.fn();
    render(
      <VersionSelector
        onSelectVersion={onSelectVersionMock}
        versionSelected="1.21.0"
      />,
    );

    const select = (screen.getByTestId(
      'version-selector-select',
    ) as unknown) as OsdsSelect;
    select.odsValueChange.emit({
      value: 'v1.22.0',
    } as OdsSelectValueChangeEventDetail);

    await waitFor(() => {
      expect(onSelectVersionMock).toHaveBeenCalledWith('v1.22.0');
    });
  });

  // Test case to check if a spinner is displayed when isPending is true
  it('displays a spinner when isPending is true', () => {
    mockUseGetCloudSchema.mockReturnValue({
      ...initQuery,
      data: undefined,
      isPending: true,
    });
    render(<VersionSelector onSelectVersion={vi.fn()} versionSelected="" />);

    expect(screen.getByTestId('version-selector-spinner')).toBeInTheDocument();
  });

  // Test case to check if there is no select element when there are no versions
  it('does not render select element when versions array is empty', () => {
    mockUseGetCloudSchema.mockReturnValue(initQuery);

    render(<VersionSelector onSelectVersion={vi.fn()} versionSelected="" />);

    expect(
      screen.queryByTestId('version-selector-select'),
    ).not.toBeInTheDocument();
  });
});
