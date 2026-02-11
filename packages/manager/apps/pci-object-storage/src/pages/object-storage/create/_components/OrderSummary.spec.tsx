import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from './OrderSummary.component';
import cloud from '@/types/Cloud';
import storages from '@/types/Storages';
import {
  mocked3AZRegion,
  mockedGRARegion,
  mockedLZRegion,
} from '@/__tests__/helpers/mocks/region/region';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';

describe('OrderSummary', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton when order is falsy', () => {
    render(<OrderSummary order={null} regions={[]} users={[]} />);

    expect(screen.getByTestId('order-summary-skeleton')).toBeTruthy();
  });

  it('renders S3 summary (3AZ) with replication enabled and destination region', () => {
    const order = {
      name: 'my-s3',
      region: 'EU-WEST-PAR',
      ownerId: 12,
      encryption: { sseAlgorithm: 'AES256' },
      versioning: { status: storages.VersioningStatusEnum.enabled },
      objectLock: { status: storages.ObjectLockStatusEnum.disabled },
      replication: {
        rules: [
          {
            destination: { region: 'BHS', name: '' },
          },
        ],
      },
    } as any;

    render(
      <OrderSummary
        order={order}
        regions={[mocked3AZRegion]}
        users={[mockedCloudUser]}
      />,
    );

    expect(screen.getByText('summaryContainerSection')).toBeTruthy();
    expect(screen.getByText('my-s3')).toBeTruthy();
    expect(screen.getByText('summaryOfferS3')).toBeTruthy();

    expect(screen.getByText('summaryLocationSection')).toBeTruthy();
    expect(screen.getByText('summaryOffsiteReplicationSection')).toBeTruthy();
    expect(screen.getByText('summaryOffsiteReplicationEnabled')).toBeTruthy();
    expect(screen.getByText('summaryOffsiteReplicationRegion')).toBeTruthy();

    expect(screen.getByText('summaryVersionningSection')).toBeTruthy();
    expect(screen.getByText('summaryVersionningEnabled')).toBeTruthy();

    expect(screen.getByText('summaryObjectLockSection')).toBeTruthy();
    expect(screen.getByText('summaryObjectLockDisabled')).toBeTruthy();

    expect(screen.getByText('summaryUserSection')).toBeTruthy();
    expect(screen.getByText(mockedCloudUser.description)).toBeTruthy();

    expect(screen.getByText('summaryEncryptionSection')).toBeTruthy();
    expect(screen.getByText('AES256')).toBeTruthy();
  });

  it('renders S3 summary (localzone) without versioning/objectLock/user/encryption sections', () => {
    const order = {
      name: 'my-s3-lz',
      region: 'RBX',
      // fields below should be ignored for localzone section rendering
      ownerId: 12,
      encryption: { sseAlgorithm: storages.EncryptionAlgorithmEnum.plaintext },
      versioning: { status: storages.VersioningStatusEnum.disabled },
      objectLock: { status: storages.ObjectLockStatusEnum.enabled },
      replication: { rules: [] },
    } as any;

    render(
      <OrderSummary order={order} regions={[mockedLZRegion]} users={[]} />,
    );

    expect(screen.getByText('my-s3-lz')).toBeTruthy();
    expect(screen.getByText('summaryOfferS3')).toBeTruthy();

    expect(screen.queryByText('summaryVersionningSection')).toBeNull();
    expect(screen.queryByText('summaryObjectLockSection')).toBeNull();
    expect(screen.queryByText('summaryUserSection')).toBeNull();
    expect(screen.queryByText('summaryEncryptionSection')).toBeNull();
  });

  it('renders Swift summary', () => {
    const order = {
      containerName: 'my-swift',
      region: 'GRA',
      containerType: storages.TypeEnum.private,
    } as any;

    render(
      <OrderSummary order={order} regions={[mockedGRARegion]} users={[]} />,
    );

    expect(screen.getByText('summaryOfferSwift')).toBeTruthy();
    expect(screen.getByText('my-swift')).toBeTruthy();
    expect(screen.getByText('summaryContainerTypeSection')).toBeTruthy();
    expect(
      screen.getByText(`containerTypeLabel-${storages.TypeEnum.private}`),
    ).toBeTruthy();
  });

  it('scrolls to target on section label click', () => {
    const regions = [
      { name: 'EU-WEST-PAR', type: cloud.RegionTypeEnum['region-3-az'] },
    ] as any;

    const order = {
      name: 'my-s3',
      region: 'EU-WEST-PAR',
      ownerId: 12,
      encryption: { sseAlgorithm: 'AES256' },
      versioning: { status: storages.VersioningStatusEnum.enabled },
      objectLock: { status: storages.ObjectLockStatusEnum.disabled },
      replication: { rules: [] },
    } as any;

    const target = document.createElement('div');
    target.id = 'name';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    render(<OrderSummary order={order} regions={regions} users={[]} />);

    fireEvent.click(screen.getByText('summaryContainerSection'));

    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});
