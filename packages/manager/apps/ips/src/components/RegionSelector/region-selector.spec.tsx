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
    { label: 'region-selector-ap-filter', cardNb: 3 },
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
    const { asFragment } = render(
      <RegionSelector regionList={[]} setSelectedRegion={vi.fn()} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('hide all filters if there is only one kind of available region', () => {
    const { queryByText, container } = render(
      <RegionSelector
        regionList={['eu-west-par', 'eu-west-gra', 'eu-west-rbx']}
        setSelectedRegion={vi.fn()}
      />,
    );

    expect(container.querySelectorAll('ods-card')).toHaveLength(3);
    expect(queryByText('region-selector-eu-filter')).not.toBeInTheDocument();
    expect(queryByText('region-selector-ca-filter')).not.toBeInTheDocument();
    expect(queryByText('region-selector-us-filter')).not.toBeInTheDocument();
    expect(queryByText('region-selector-ap-filter')).not.toBeInTheDocument();
    expect(
      queryByText('region-selector-all-locations'),
    ).not.toBeInTheDocument();
  });

  it.each([
    {
      list: [
        'us-west-lz-lax',
        'us-east-lz-chi',
        'us-east-lz-nyc',
        'eu-west-rbx',
      ],
      missingFilters: ['ca', 'ap'],
    },
    {
      list: ['eu-west-par', 'eu-west-gra', 'eu-west-rbx', 'ca-east-tor'],
      missingFilters: ['us', 'ap'],
    },
    {
      list: [
        'us-west-lz-lax',
        'us-east-lz-chi',
        'us-east-lz-nyc',
        'ca-east-tor',
        'ap-south-mum',
      ],
      missingFilters: ['eu'],
    },
    {
      list: ['ap-south-mum', 'us-east-lz-chi', 'us-east-lz-nyc'],
      missingFilters: ['eu', 'ca'],
    },
  ])(
    'hide filters if there is no corresponding regions',
    ({ list, missingFilters }) => {
      const { queryByText } = render(
        <RegionSelector regionList={list} setSelectedRegion={vi.fn()} />,
      );

      missingFilters.forEach((tab) => {
        expect(
          queryByText(`region-selector-${tab}-filter`),
        ).not.toBeInTheDocument();
      });
    },
  );
});
