type CreateBillingTileArgs = Partial<{
  language?: string;
  dataTracking?: string;
  offer?: string;
  servicePath: string;
}>;

export const createBillingTile = ({
  language,
  dataTracking,
  offer,
  servicePath,
}: CreateBillingTileArgs) =>
  `
    <msc-billing-tile
      language="${language}"
      data-tracking="${dataTracking}"
      offer="${offer}"
      service-path="${servicePath}"
    >
    </msc-billing-tile>
  `;

export default createBillingTile;
