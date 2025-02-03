import 'element-internals-polyfill';
import { describe, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import queryClient from '@/queryClient';
import { Region } from '@/api/data/region';
import S3StorageRegions from './S3StorageRegions';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('@/api/hooks/useRegion', () => {
  const regions: Region[] = [
    {
      name: 'BHS',
      type: 'type',
      services: [],
      datacenterLocation: '',
      ipCountries: [],
      status: '',
      continentCode: '',
    },
    {
      name: 'SBG',
      type: 'type',
      services: [],
      datacenterLocation: '',
      ipCountries: [],
      status: '',
      continentCode: '',
    },
  ];
  return {
    useS3StorageRegions: () => ({
      data: regions,
    }),
  };
});

function renderComponent() {
  render(
    <QueryClientProvider client={queryClient}>
      <S3StorageRegions
        projectId="foo"
        onS3StorageRegionChange={() => {}}
      ></S3StorageRegions>
      ,
    </QueryClientProvider>,
  );
}

describe('S3StorageRegions components', () => {
  it('should call the S3StorageRegions component and check if have correct value', async () => {
    renderComponent();
    const currentRegionSelect = screen.getByTestId('currentRegionSelect');
    expect(currentRegionSelect).toHaveValue('BHS');
    expect(currentRegionSelect).not.toHaveValue('SBG');
  });
});
