type CreateTileArgs = Partial<{
  category: string;
  tileTitle: string;
  tileDescription: string;
  href: string;
  isExternalHref: boolean;
  dataTracking: string;
  imgSrc: string;
  imgAlt: string;
  locale: string;
  hasBadges: boolean;
  hasFooter: boolean;
}>;

export const createTile = ({
  category,
  tileTitle,
  tileDescription,
  href,
  isExternalHref,
  dataTracking,
  imgSrc,
  imgAlt,
  locale,
  hasBadges,
  hasFooter,
}: CreateTileArgs) =>
  `
    <msc-tile
      category="${category}"
      tile-title="${tileTitle}"
      tile-description="${tileDescription}"
      href="${href}"
      ${isExternalHref ? 'is-external-href="true"' : ''}
      img-src="${imgSrc}"
      img-alt="${imgAlt}"
      data-tracking="${dataTracking}"
      locale="${locale}"
    >
      ${hasBadges
    ? `
        <span slot="badges">
          <osds-chip color="primary" size="sm" inline>OVHcloud</osds-chip>
          <osds-chip color="success" size="sm" inline>Beta</osds-chip>
        </span>
      `
    : ''
  }
      ${hasFooter
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
