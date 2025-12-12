import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';
import useContainer from '@/core/container';
import style from './style.module.scss';
import clsx from 'clsx';

export type Props = {
  children?: JSX.Element;
  onClick(show: boolean): void;
  show?: boolean;
};

function LanguageButton({
  children = null,
  onClick,
  show = false,
}: Props): JSX.Element {
  const { t } = useTranslation('language');
  const { useBeta } = useContainer();
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });


  const buttonClassName = clsx(
    'oui-navbar-link oui-navbar-link_dropdown',
    style.navbarFontSize,
    isSmallDevice ? 'p-0' : '-ml-[0.75rem]',
    useBeta && style.contrastedButton,
  );

  return (
    <button
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('language_change')}
      title={t('language_change')}
      type="button"
      className={buttonClassName}
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
      data-testid="languageButton"
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
        {!isSmallDevice && (
          <span className="oui-icon oui-icon-chevron-down ml-2"></span>
        )}
      </span>
    </button>
  );
}

export default LanguageButton;
