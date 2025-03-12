import { useTranslation } from 'react-i18next';
import { OsdsChip, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { clsx } from 'clsx';
import { TRegion } from '@/api/data';
import {
  Region3AZChip,
  RegionGlobalzoneChip,
  RegionLocalzoneChip,
} from '../region-selector';
import './style.scss';
import '@/translations/deployment-mode';

const RegionChipByType = ({ type }: Readonly<{ type: TRegion['type'] }>) => {
  switch (type) {
    case 'localzone':
      return <RegionLocalzoneChip showTooltip={false} />;
    case 'region':
      return <RegionGlobalzoneChip showTooltip={false} />;
    case 'region-3-az':
      return <Region3AZChip showTooltip={false} />;
    default:
      return null;
  }
};

export type DeploymentModeCardProps = Readonly<{
  type: TRegion['type'];
  beta?: boolean;
  comingSoon?: boolean;
  leastPrice?: number;
  labelId?: string;
  ariaDetailsId?: string;
}>;

export const DeploymentModeCard = ({
  type,
  beta,
  comingSoon,
  leastPrice,
  labelId,
  ariaDetailsId,
}: DeploymentModeCardProps) => {
  const { t } = useTranslation('deployment-mode');

  return (
    <OsdsTile className="deployment-mode-card">
      <div className="deployment-mode-card__content">
        <div className="deployment-mode-card__header">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            className={clsx('leading-8')}
            id={labelId}
          >
            {t(`deployment_mode_title_${type}`)}
          </OsdsText>
        </div>

        <div id={ariaDetailsId} className="deployment-mode-card__content">
          <div className="mb-3">
            <RegionChipByType type={type} />
          </div>
          <div className="mb-3 text-center">
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(`deployment_mode_description_${type}`)}
            </OsdsText>
          </div>
          <div>
            {beta && (
              <div>
                <OsdsChip
                  className="m-3"
                  color={ODS_THEME_COLOR_INTENT.success}
                  size={ODS_CHIP_SIZE.sm}
                  inline
                >
                  {t('deployment_mode_beta')}
                </OsdsChip>
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="uppercase font-bold"
                >
                  {t('deployment_mode_beta_price')}
                </OsdsText>
              </div>
            )}
            {comingSoon && (
              <div>
                <OsdsChip className="m-3" size={ODS_CHIP_SIZE.sm} inline>
                  {t('deployment_mode_coming_soon')}
                </OsdsChip>
              </div>
            )}
            {leastPrice}
          </div>
        </div>
      </div>
    </OsdsTile>
  );
};
