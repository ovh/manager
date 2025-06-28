import React, {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useId,
  useMemo,
} from 'react';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { CheckboxControl } from '@/components/internal/checkbox/Checkbox';
import { RadioControl } from '@/components/internal/radio/Radio';
import { TPrice } from '@/dto/price';
import './style.scss';
import { Badge } from '@/components/badge/Badge';

const Text = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<ComponentProps<'span'>>) => (
  <span
    className={clsx(
      className,
      'text-[14px] leading-[100%] text-[--ods-color-text]',
    )}
    {...otherProps}
  >
    {children}
  </span>
);

const SmallText = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<ComponentProps<'span'>>) => (
  <span
    className={clsx(
      className,
      'text-[12px] leading-[100%] text-[--ods-color-text]',
    )}
    {...otherProps}
  >
    {children}
  </span>
);

const Title = ({ children, ...divProps }: ComponentProps<'div'>) => (
  <div {...divProps}>
    <OdsText preset="heading-5">{children}</OdsText>
  </div>
);

const Description = ({ children }: PropsWithChildren) => (
  <Text>{children}</Text>
);

const PriceFrom = () => {
  const { t } = useTranslation('pci-common');

  return (
    <div>
      <span className="text-[12px] leading-[100%] font-bold text-[--ods-color-text]">
        {t('common_price_from')}
      </span>
    </div>
  );
};

const Price = ({ value, unit }: Pick<TPrice, 'value' | 'unit'>) => (
  <div>
    <span className="leading-[100%] text-[--ods-color-text] text-[20px] font-bold">
      {value}
    </span>

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

const Badges = ({ badges }: { badges: ComponentProps<typeof Badge>[] }) => (
  <div className="inline-flex gap-4 flex-wrap">
    {badges.map((b) => (
      <Badge key={b.label} size={b.size ?? 'sm'} {...b} />
    ))}
  </div>
);

export type ConfigCardElementProps = {
  label: string;
  badges?: ComponentProps<typeof Badge>[];
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
                {i !== 0 && <OdsDivider />}
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
