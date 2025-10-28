import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Estimation, { EstimationRow } from './Estimation.component';

describe('Estimation component', () => {
  const cases: {
    description: string;
    rows: EstimationRow[];
    expectedLabels: string[];
    hiddenLabels: string[];
    expectedValues?: string[];
  }[] = [
    {
      description: 'some rows shown, some hidden, some with value',
      rows: [
        { label: 'row1', value: '100 €/mo', show: true },
        { label: 'row2', value: '200 €/mo', show: false },
        { label: 'row3', show: true },
        { label: 'row4', value: '300 €/mo', show: true },
      ],
      expectedLabels: ['row1', 'row3', 'row4'],
      hiddenLabels: ['row2'],
      expectedValues: ['100 €/mo', '300 €/mo'],
    },
    {
      description: 'all rows hidden',
      rows: [
        { label: 'row1', value: '100 €/mo', show: false },
        { label: 'row2', show: false },
      ],
      expectedLabels: [],
      hiddenLabels: ['row1', 'row2'],
      expectedValues: [],
    },
    {
      description: 'all rows shown with value',
      rows: [
        { label: 'row1', value: '50 €/mo', show: true },
        { label: 'row2', value: '150 €/mo', show: true },
      ],
      expectedLabels: ['row1', 'row2'],
      hiddenLabels: [],
      expectedValues: ['50 €/mo', '150 €/mo'],
    },
  ];

  it.each(cases)('$description', ({ rows, expectedLabels, hiddenLabels, expectedValues }) => {
    render(<Estimation rows={rows} />);

    expect(screen.getByText('kube_common_node_pool_estimated_cost')).toBeDefined();

    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeVisible();
    });

    hiddenLabels.forEach((label) => {
      expect(screen.queryByText(label)).toBeNull();
    });

    expectedValues?.forEach((value) => {
      expect(screen.getByText(value)).toBeVisible();
    });
  });
});
