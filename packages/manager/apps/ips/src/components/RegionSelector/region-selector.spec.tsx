import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegionSelector } from './region-selector.component';
import '@testing-library/jest-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

const regionList = [
  'eu-west-par',
  'eu-west-gra',
  'eu-west-rbx',
  'eu-west-sbg',
  'eu-west-lim',
  'eu-central-waw',
  'eu-west-eri',
  'us-east-vin',
  'us-west-hil',
  'ca-east-bhs',
  'ap-southeast-sgp',
  'ap-southeast-syd',
  'eu-west-rbx-snc',
  'eu-west-sbg-snc',
  'ca-east-tor',
  'ap-south-mum',
  'labeu-west-1-preprod',
  'labeu-west-1-dev-2',
  'labeu-west-1-dev-1',
  'eu-west-lz-bru',
  'eu-west-lz-mad',
  'eu-west-gra-snc',
  'us-east-lz-dal',
  'us-west-lz-lax',
  'us-east-lz-chi',
  'us-east-lz-nyc',
  'us-east-lz-mia',
  'us-west-lz-pao',
  'us-west-lz-den',
  'us-east-lz-atl',
  'eu-west-lz-mrs',
];

describe('RegionSelector component', () => {
  it('renders correctly', async () => {
    const spy = vi.fn();
    const { asFragment, container, getByText } = render(
      <RegionSelector
        selectedRegion="eu-west-gra"
        regionList={regionList}
        setSelectedRegion={spy}
      />,
    );

    expect(container.querySelectorAll('ods-card')).toHaveLength(
      regionList.length,
    );
    expect(asFragment()).toMatchSnapshot();

    const newRegion = 'us-west-lz-den';
    await waitFor(() => userEvent.click(getByText(newRegion)));
    expect(spy).toHaveBeenCalledWith(newRegion);
  });

  it.each([
    { label: 'region-selector-eu-filter', cardNb: 16 },
    { label: 'region-selector-ca-filter', cardNb: 2 },
    { label: 'region-selector-us-filter', cardNb: 10 },
  ])('filters correctly', async ({ label, cardNb }) => {
    const { getByText, container } = render(
      <RegionSelector regionList={regionList} setSelectedRegion={vi.fn()} />,
    );

    const filterTab = getByText(label);
    await waitFor(() => userEvent.click(filterTab));

    expect(container.querySelectorAll('ods-card')).toHaveLength(cardNb);

    await waitFor(() =>
      userEvent.click(getByText('region-selector-all-locations')),
    );
    expect(container.querySelectorAll('ods-card')).toHaveLength(
      regionList.length,
    );
  });

  it('does not break if there is no region at all', () => {
    const { getByText } = render(
      <RegionSelector regionList={[]} setSelectedRegion={vi.fn()} />,
    );

    expect(getByText('region-selector-all-locations')).toBeInTheDocument();
  });

  it.each([
    {
      list: ['us-west-lz-lax', 'us-east-lz-chi', 'us-east-lz-nyc'],
      disabledFilters: ['eu', 'ca'],
    },
    {
      list: ['eu-west-par', 'eu-west-gra', 'eu-west-rbx'],
      disabledFilters: ['us', 'ca'],
    },
    {
      list: [
        'eu-west-par',
        'eu-west-gra',
        'eu-west-rbx',
        'ca-east-tor',
        'ap-south-mum',
      ],
      disabledFilters: ['us'],
    },
  ])(
    'disable filters if there is no corresponding regions',
    ({ list, disabledFilters }) => {
      const { getByText } = render(
        <RegionSelector regionList={list} setSelectedRegion={vi.fn()} />,
      );

      disabledFilters.forEach((tab) => {
        expect(getByText(`region-selector-${tab}-filter`)).toHaveAttribute(
          'is-disabled',
          'true',
        );
      });
    },
  );
});
