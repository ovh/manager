import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming'
import { Locale, defaultLocale } from '@ovhcloud/msc-utils'
import { OsdsText } from '@ovhcloud/ods-components/text/react'
import { OsdsChip } from '@ovhcloud/ods-components/chip/react'
import { OsdsTile } from '@ovhcloud/ods-components/tile/react'
import { OsdsLink } from '@ovhcloud/ods-components/link/react'
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react'

import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon'
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text'

interface Badge {
  text: string
  color: string
}

export interface MscTileProps {
  href?: string
  isExternalHref?: boolean
  imgSrc?: string
  imgAlt?: string
  category: string
  tileTitle: string
  tileDescription: string
  dataTracking?: string
  locale?: any
  badges?: Badge[]
  footer?: React.ReactElement
}

const ScTile = ({
  href,
  isExternalHref,
  category,
  imgSrc,
  imgAlt,
  tileDescription,
  tileTitle,
  dataTracking,
  badges,
  footer,
}: MscTileProps) => {
  const localeStrings = { see_more_label: 'See more' }
  const hasFooterContent = 0
  return (
    <div className="tile-container">
      <OsdsTile className="msc-ods-tile" color={ODS_THEME_COLOR_INTENT.primary} rounded inline>
        <div className="flex flex-col">
          {imgSrc && <img className="max-w-full my-3 mx-auto" src={imgSrc} alt={imgAlt} />}
          <OsdsText
            className="block"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._200}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {category}
            <span className="inline-flex ml-3">
              {badges?.map((b) => (
                <OsdsChip key={b.text} color={b.color}>
                  {b.text}
                </OsdsChip>
              ))}
            </span>
          </OsdsText>

          <OsdsText
            className="block mb-5"
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tileTitle}
          </OsdsText>
          <OsdsText
            className="block mb-4"
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {tileDescription}
          </OsdsText>
          <OsdsLink
            tabIndex={hasFooterContent ? 0 : -1}
            data-tracking={dataTracking}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
          >
            {localeStrings?.see_more_label}
            <OsdsIcon
              slot="end"
              className="ml-4"
              aria-hidden="true"
              size={ODS_ICON_SIZE.xxs}
              name={isExternalHref ? ODS_ICON_NAME.EXTERNAL_LINK : ODS_ICON_NAME.ARROW_RIGHT}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsLink>
          {footer}
        </div>
      </OsdsTile>
    </div>
  )
}

export default ScTile
