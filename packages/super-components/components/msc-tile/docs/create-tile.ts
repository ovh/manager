type CreateTileArgs = Partial<{
  tileType: string;
  tileTitle: string;
  tileDescription: string;
  href: string;
  isExternalHref: boolean;
  seeMoreLabel: string;
  dataTracking: string;
  imgSrc: string;
  imgAlt: string;
  hasBadges: boolean;
  hasFooter: boolean;
}>;

export const createTile = ({
  tileType,
  tileTitle,
  tileDescription,
  href,
  isExternalHref,
  seeMoreLabel,
  dataTracking,
  imgSrc,
  imgAlt,
  hasBadges,
  hasFooter,
}: CreateTileArgs) =>
  `
    <msc-tile
      tile-type="${tileType}"
      tile-title="${tileTitle}"
      tile-description="${tileDescription}"
      href="${href}"
      ${isExternalHref ? 'is-external-href="true"' : ''}
      img-src="${imgSrc}"
      img-alt="${imgAlt}"
      see-more-label="${seeMoreLabel}"
      data-tracking="${dataTracking}"
    >
      ${
        hasBadges
          ? `
        <span slot="badges">
          <osds-chip color="primary" size="sm">OVHcloud</osds-chip>
          <osds-chip color="success" size="sm">Beta</osds-chip>
        </span>
      `
          : ''
      }
      ${
        hasFooter
          ? `
        <div slot="footer">
          <osds-button color="primary" style="margin-top: 1.5rem">Commander</osds-button>
        </div>
      `
          : ''
      }
    </msc-tile>
  `;

export default createTile;
