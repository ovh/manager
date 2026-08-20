import { describe, expect, it } from 'vitest';
import selectGatewayPrices, { TGatewayPriceRow } from './selectGatewayPrices';

const t = (translationKey: string, params?: Record<string, string>) =>
  params
    ? `${translationKey}(${Object.values(params).join('|')})`
    : translationKey;

const getPrices = selectGatewayPrices(
  t,
  (price) => `${price}/h`,
  (price) => `${price}/mo`,
  (hourlyPrice) => hourlyPrice * 730,
);

const hourlyWithMonthly = (hourlyPrice: number) =>
  `pci_projects_project_public_gateways_add_cost_hourly_with_monthly(${hourlyPrice}/h|${hourlyPrice *
    730}/mo)`;

const gatewayRow = (hourlyPrice: number, size: string): TGatewayPriceRow => ({
  type: 'price',
  show: true,
  label: `pci_projects_project_public_gateways_add_cost_gateway(${size})`,
  value: `${hourlyPrice}/h`,
});

const publicIpRow = (hourlyPrice: number): TGatewayPriceRow => ({
  type: 'price',
  show: true,
  label: 'pci_projects_project_public_gateways_add_cost_public_ip',
  value: `${hourlyPrice}/h`,
});

const hiddenPublicIpRow: TGatewayPriceRow = {
  type: 'price',
  show: false,
  label: 'pci_projects_project_public_gateways_add_cost_public_ip',
};

const publicIpNoticeRow: TGatewayPriceRow = {
  type: 'notice',
  show: true,
  label: 'pci_projects_project_public_gateways_add_cost_public_ip_info',
  value: '',
};

const totalRow = (hourlyPrice: number): TGatewayPriceRow => ({
  type: 'price',
  show: true,
  label: 'pci_projects_project_public_gateways_add_cost_total',
  value: hourlyWithMonthly(hourlyPrice),
});

describe.each<[string, string, number, number | null, TGatewayPriceRow[]]>([
  [
    'a gateway whose public IP the catalog prices',
    's',
    1000,
    400,
    [
      gatewayRow(1000, 'S'),
      publicIpRow(400),
      publicIpNoticeRow,
      totalRow(1400),
    ],
  ],
  [
    'a gateway whose public IP the catalog does not price',
    'm',
    1000,
    null,
    [
      gatewayRow(1000, 'M'),
      hiddenPublicIpRow,
      publicIpNoticeRow,
      totalRow(1000),
    ],
  ],
  [
    'a gateway whose public IP is free of charge',
    'l',
    1000,
    0,
    [gatewayRow(1000, 'L'), publicIpRow(0), publicIpNoticeRow, totalRow(1000)],
  ],
])(
  'given %s',
  (_, size, gatewayHourlyPrice, publicIpHourlyPrice, expectedRows) => {
    describe('when pricing the gateway', () => {
      let rows: TGatewayPriceRow[];

      beforeEach(() => {
        rows = getPrices(size, gatewayHourlyPrice, publicIpHourlyPrice);
      });

      it('charges the gateway and the public IP it needs', () => {
        expect(rows).toEqual(expectedRows);
      });
    });
  },
);
