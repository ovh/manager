import { useTranslation } from 'react-i18next';
import '@/translations/deployment-mode';
import clsx from 'clsx';
import { PropsWithChildren, ReactNode } from 'react';
import { RegionChipByType } from '@/components/region-selector/RegionChipByType';
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card/Card';

export type DeploymentModeCardProps = Readonly<
  PropsWithChildren<{
    labelId?: string;
    ariaDetailsId?: string;
    name: string;
    price?: ReactNode;
    className?: string;
  }>
>;

const backgroundStyle =
  'peer-enabled:hover:bg-[--ods-color-primary-100] peer-checked:bg-[--ods-color-primary-100] peer-enabled:cursor-pointer';
const borderStyle =
  'peer-enabled:hover:border-[--ods-color-primary-600] peer-checked:border-[--ods-color-primary-600] peer-focus-visible:border-[--ods-color-primary-600]';
const disabledStyle = 'peer-disabled:opacity-50';

export const DeploymentModeCard = ({
  name,
  price,
  labelId,
  ariaDetailsId,
  className,
  children,
}: DeploymentModeCardProps) => {
  const { t } = useTranslation('deployment-mode');

  return (
    <Card
      className={clsx(
        'items-center',
        backgroundStyle,
        borderStyle,
        disabledStyle,
        // With tailwind 3 we can't style children from group, but we can style children from parent
        'peer-checked:[&_.deployment-mode-card-title::part(text)]:font-bold',
        className,
      )}
    >
      <CardHeader>
        <CardTitle id={labelId} className="deployment-mode-card-title">
          {t(`deployment_mode_card_title_${name}`)}
        </CardTitle>
      </CardHeader>
      <CardBody id={ariaDetailsId}>
        <div>
          <RegionChipByType type={name} />
        </div>

        <div className="text-center">
          <CardDescription>
            {t(`deployment_mode_card_description_${name}`)}
          </CardDescription>
        </div>

        <div>{price}</div>

        <div>{children}</div>
      </CardBody>
    </Card>
  );
};
