import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { TGatewayPriceRow } from '@/pages/add/view-models/selectGatewayPrices';

const GatewayPrices = ({ rows }: Readonly<{ rows: TGatewayPriceRow[] }>) => (
  <div className="flex flex-col mb-6">
    {rows
      .filter((row) => row.show)
      .map(({ type, label, value }) =>
        type === 'notice' ? (
          <OsdsMessage
            key={label}
            type={ODS_MESSAGE_TYPE.info}
            color={ODS_THEME_COLOR_INTENT.info}
            className="my-4 flex-row"
          >
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {label}
            </OsdsText>
          </OsdsMessage>
        ) : (
          <p className="mb-2" key={label}>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <span className="font-bold">{label}</span> {value}
            </OsdsText>
          </p>
        ),
      )}
  </div>
);

export default GatewayPrices;
