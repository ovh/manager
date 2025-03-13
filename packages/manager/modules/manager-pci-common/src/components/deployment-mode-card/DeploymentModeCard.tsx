import { useTranslation } from 'react-i18next';
import { OsdsChip, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { clsx } from 'clsx';
import './style.scss';
import '@/translations/deployment-mode';
import { RegionChipByType } from '@/components/region-selector/RegionChipByType';
import { TDeployment } from '@/dto';

export type DeploymentModeCardProps = Readonly<
  {
    labelId?: string;
    ariaDetailsId?: string;
  } & TDeployment
>;

export const DeploymentModeCard = ({
  name,
  beta,
  comingSoon,
  price,
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
            {t(`deployment_mode_card_title_${name}`)}
          </OsdsText>
        </div>

        <div id={ariaDetailsId} className="deployment-mode-card__content">
          <div className="mb-3">
            <RegionChipByType type={name} showTooltip={false} />
          </div>
          <div className="mb-3 text-center">
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(`deployment_mode_card_description_${name}`)}
            </OsdsText>
          </div>
          <div className="mb-3">
            {beta && (
              <div>
                <OsdsChip
                  className="m-3"
                  color={ODS_THEME_COLOR_INTENT.success}
                  size={ODS_CHIP_SIZE.sm}
                  inline
                >
                  {t('deployment_mode_card_beta')}
                </OsdsChip>
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="uppercase font-bold"
                >
                  {t('deployment_mode_card_beta_price')}
                </OsdsText>
              </div>
            )}
            {comingSoon && (
              <div>
                <OsdsChip className="m-3" size={ODS_CHIP_SIZE.sm} inline>
                  {t('deployment_mode_card_coming_soon')}
                </OsdsChip>
              </div>
            )}
            <div className="mb-3">{price}</div>
          </div>
        </div>
      </div>
    </OsdsTile>
  );
};
