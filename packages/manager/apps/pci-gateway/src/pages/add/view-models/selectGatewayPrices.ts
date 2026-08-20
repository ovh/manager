export type TPriceRowType = 'price' | 'notice';

export type TGatewayPriceRow =
  | {
      type: TPriceRowType;
      label: string;
      value: string;
      show: true;
    }
  | {
      type: TPriceRowType;
      label: string;
      value?: null;
      show: false;
    };

const selectGatewayPrices = (
  t: (translationKey: string, params?: Record<string, string>) => string,
  getFormattedHourlyCatalogPrice: (price: number) => string,
  getFormattedMonthlyCatalogPrice: (price: number) => string,
  convertHourlyPriceToMonthly: (price: number) => number,
) => (
  size: string,
  gatewayHourlyPrice: number,
  publicIpHourlyPrice: number | null,
): TGatewayPriceRow[] => {
  const monthlyPrice = (hourlyPrice: number) =>
    getFormattedMonthlyCatalogPrice(convertHourlyPriceToMonthly(hourlyPrice));

  const hourlyPriceWithMonthlyEstimate = (hourlyPrice: number) =>
    t('pci_projects_project_public_gateways_add_cost_hourly_with_monthly', {
      hourlyPrice: getFormattedHourlyCatalogPrice(hourlyPrice),
      monthlyPrice: monthlyPrice(hourlyPrice),
    });

  const carriesPublicIp = publicIpHourlyPrice !== null;
  const totalHourlyPrice = gatewayHourlyPrice + (publicIpHourlyPrice ?? 0);

  const prices: [TPriceRowType, string, boolean, string?][] = [
    [
      'price',
      t('pci_projects_project_public_gateways_add_cost_gateway', {
        size: size?.toUpperCase() ?? '',
      }),
      true,
      getFormattedHourlyCatalogPrice(gatewayHourlyPrice),
    ],
    [
      'price',
      t('pci_projects_project_public_gateways_add_cost_public_ip'),
      carriesPublicIp,
      carriesPublicIp
        ? getFormattedHourlyCatalogPrice(publicIpHourlyPrice)
        : undefined,
    ],
    [
      'notice',
      t('pci_projects_project_public_gateways_add_cost_public_ip_info'),
      true,
    ],
    [
      'price',
      t('pci_projects_project_public_gateways_add_cost_total'),
      true,
      hourlyPriceWithMonthlyEstimate(totalHourlyPrice),
    ],
  ];

  return prices.map(
    ([type, label, condition, value]): TGatewayPriceRow =>
      condition
        ? { type, show: true, label, value: value ?? '' }
        : { type, show: false, label },
  );
};

export default selectGatewayPrices;
