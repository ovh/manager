import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HourlyConsumption from './HourlyConsumption.component';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import { wrapper } from '@/wrapperRenders';

describe('HourlyConsumption', () => {
  const mockConsumption = {
    hourlyInstances: [],
    snapshots: [],
    volumes: [],
    objectStorages: [],
    archiveStorages: [],
    coldArchive: [],
    bandwidthByRegions: [],
    privateRegistry: [],
    kubernetesLoadBalancer: [],
    training: [],
    notebooks: [],
    aiDeploy: [],
    dataProcessing: [],
    databases: [],
    floatingIP: [],
    publicIP: [],
    gateway: [],
    octaviaLoadBalancer: [],
    totals: {
      hourly: {
        instance: 10.5,
        snapshot: 5.25,
        volume: 7.75,
      },
    },
  } as TConsumptionDetail;

  it('renders accordions for non-trusted zone', () => {
    render(
      <HourlyConsumption consumption={mockConsumption} isTrustedZone={false} />,
      { wrapper },
    );

    const expectedElementKeys = [
      'archiveStorage',
      'coldArchive',
      'privateRegistry',
      'kubernetesLoadBalancer',
      'training',
      'aiDeploy',
      'dataProcessing',
      'databases',
      'floatingIP',
      'publicIP',
      'gateway',
      'octaviaLoadBalancer',
    ];

    expectedElementKeys.forEach((key) => {
      const accordionTitle = screen.getByTestId(key);
      expect(accordionTitle).toBeInTheDocument();
    });
  });

  it('renders fewer accordions for trusted zone', () => {
    render(<HourlyConsumption consumption={mockConsumption} isTrustedZone />, {
      wrapper,
    });

    const expectedElementKeys = [
      'instance',
      'snapshot',
      'volume',
      'objectStorage',
      'bandwidth',
      'notebooks',
    ];

    expectedElementKeys.forEach((key) => {
      const accordionTitle = screen.getByTestId(key);
      expect(accordionTitle).toBeInTheDocument();
    });
  });
});
