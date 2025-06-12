import React, {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useId,
  useMemo,
} from 'react';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { CheckboxControl } from '@/components/internal/checkbox/Checkbox';
import { Badge, BadgeProps } from '../badge/Badge';
import { RadioControl } from '@/components/internal/radio/Radio';
import { TPrice } from '@/dto/price';
import './style.scss';

const Text = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<
  Omit<ComponentProps<typeof OsdsText>, 'color' | 'size'>
>) => (
  <OsdsText
    color={ODS_TEXT_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._100}
    className={clsx(className, 'text-[14px] leading-[100%]')}
    {...otherProps}
  >
    {children}
  </OsdsText>
);

const SmallText = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<
  Omit<ComponentProps<typeof OsdsText>, 'color' | 'size'>
>) => (
  <OsdsText
    color={ODS_TEXT_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._100}
    className={clsx(className, 'text-[12px] leading-[100%]')}
    {...otherProps}
  >
    {children}
  </OsdsText>
);

const Title = ({ children, ...divProps }: ComponentProps<'div'>) => (
  <div {...divProps}>
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.primary}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._300}
      hue={ODS_TEXT_COLOR_HUE._800}
    >
      {children}
    </OsdsText>
  </div>
);

const Description = ({ children }: PropsWithChildren) => (
  <Text>{children}</Text>
);

const PriceFrom = () => {
  const { t } = useTranslation('pci-common');

  return (
    <div>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        className="text-[12px] leading-[100%] font-bold"
      >
        {t('common_price_from')}
      </OsdsText>
    </div>
  );
};

const Price = ({ value, unit }: Pick<TPrice, 'value' | 'unit'>) => (
  <div>
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.primary}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._400}
      className="leading-[100%]"
    >
      {value}
    </OsdsText>

    <SmallText className="ml-2">{unit}</SmallText>
  </div>
);

const PriceDescriptions = ({ descriptions }: { descriptions: string[] }) => (
  <div>
    {descriptions.map((d) => (
      <div key={d} className="leading-[100%]">
        <SmallText>{d}</SmallText>
      </div>
    ))}
  </div>
);

const Features = ({ features }: { features: string[] }) => (
  <ul className="list-['✓'] marker:text-[#2B8000] pl-6 mb-0">
    {features.map((f) => (
      <li key={f} className="pl-5">
        <Text>{f}</Text>
      </li>
    ))}
  </ul>
);

const Badges = ({ badges }: { badges: BadgeProps[] }) => (
  <div className="inline-flex gap-4 flex-wrap">
    {badges.map((b) => (
      <Badge key={b.label} size={b.size ?? 'sm'} {...b} />
    ))}
  </div>
);

export type ConfigCardElementProps = {
  label: string;
  badges?: BadgeProps[];
  description?: string;
  features?: string[];
  // ReactNode is deprecated
  price?: TPrice | ReactNode;
};

export type ConfigCardProps = ConfigCardElementProps & {
  inputProps: ComponentProps<'input'>;
};

export const ConfigCard = ({
  label,
  badges,
  description,
  features,
  price,
  inputProps,
}: ConfigCardProps) => {
  const labelId = useId();
  const ariaDetailsId = useId();

  const sections: ReactNode[] = [];

  if (description) sections.push(<Description>{description}</Description>);

  if (features) sections.push(<Features features={features} />);

  const mergedInputProps = useMemo(
    () => ({
      ...inputProps,
      'aria-labelledby': labelId,
      'aria-details': ariaDetailsId,
    }),
    [inputProps, labelId, ariaDetailsId],
  );
  let input: ReactNode;
  if (mergedInputProps.type === 'checkbox') {
    input = <CheckboxControl {...mergedInputProps} />;
  } else if (mergedInputProps.type === 'radio') {
    input = <RadioControl {...mergedInputProps} />;
  } else {
    input = <input {...mergedInputProps} />;
  }

  return (
    <label>
      <div className="config-card">
        <div className="config-card__header">
          <div className="flex flex-col gap-[8px]">
            <div className="inline-flex items-center gap-4 mb-2">
              {input}
              <Title id={labelId}>{label}</Title>
            </div>

            {!!badges && badges.length > 0 && <Badges badges={badges} />}
          </div>
        </div>

        {sections.length > 0 && (
          <div className="config-card__body" id={ariaDetailsId}>
            {sections.map((section, i) => (
              <div key={i}>
                {i !== 0 && <OsdsDivider separator />}
                <div className="config-card__body-section">{section}</div>
              </div>
            ))}
          </div>
        )}

        {!!price && typeof price === 'object' && 'value' in price && (
          <div className="config-card__footer">
            {price.isLeastPrice && <PriceFrom />}

            <Price value={price.value} unit={price.unit} />

            {!!price.descriptions && price.descriptions.length > 0 && (
              <PriceDescriptions descriptions={price.descriptions} />
            )}
          </div>
        )}

        {/* Deprecated, use price object */}
        {!!price && React.isValidElement(price) && (
          <div className="config-card__footer">{price}</div>
        )}
      </div>
    </label>
  );
};
