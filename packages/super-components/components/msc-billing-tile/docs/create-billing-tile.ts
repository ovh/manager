type CreateBillingTileArgs = Partial<{
  language?: string;
  dataTracking?: string;
  offer?: string;
}>;

export const createBillingTile = ({
  language,
  dataTracking,
  offer,
}: CreateBillingTileArgs) =>
  `
    <msc-billing-tile
      language="${language}"
      data-tracking="${dataTracking}"
      offer="${offer}"
    >
    </msc-billing-tile>
  `;

export default createBillingTile;
