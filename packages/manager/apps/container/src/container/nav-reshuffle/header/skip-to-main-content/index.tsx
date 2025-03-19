import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { useShell } from '@/context';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

export interface Props {
  iframeRef: React.MutableRefObject<HTMLIFrameElement>;
}

const SkipToMainContent = (props: Props) => {
  const { iframeRef } = props;
  const {
    skipToTheMainContentSlot,
  } = useProductNavReshuffle();
  const [isButtonDisplayed, setIsButtonDisplayed] = useState(false);
  const buttonRef = useRef<HTMLOsdsButtonElement>(null);
  const { t } = useTranslation('sidebar');

  useEffect(() => {
    buttonRef?.current?.addEventListener('keydown', handleKeyDown);
    return () => {
      buttonRef?.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [skipToTheMainContentSlot]);

  const skipToMainTheContent = () => {
    const mainContent = iframeRef?.current?.contentWindow?.document?.getElementById(
      'maincontent',
    );
    const mainView = iframeRef?.current?.contentWindow?.document?.getElementById(
      'mainview',
    );

    iframeRef?.current?.focus();
    if (mainContent) {
      mainContent.focus();
      if (mainView) {
        const rect = mainContent.getBoundingClientRect();
        mainView.scrollTo(0, rect?.y || 0);
      }
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') skipToMainTheContent();
  };

  const handleClick = () => {
    skipToMainTheContent();
  }

  const handleBlur = () => {
    setIsButtonDisplayed(false);
  };

  const handleFocus = () => {
    setIsButtonDisplayed(true);
  };

  return (
    <>
      <OsdsButton
        data-testid="skipToMainContent"
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        role="button"
        ref={buttonRef}
        onClick={handleClick}
        className={isButtonDisplayed ? 'flex' : 'hidden'}
        >
        {t('sidebar_skip_to_the_main_content')}
      </OsdsButton>
      {skipToTheMainContentSlot?.current && createPortal(
        <a
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(e: any) => handleKeyDown(e)}
          tabIndex={0}
          className="block w-0 overflow-hidden"
          aria-label={t('sidebar_skip_to_the_main_content')}
          role="button"
          data-testid="skipToMainContentLink"
        >{t('sidebar_skip_to_the_main_content')}</a>,
        skipToTheMainContentSlot.current,
      )}
    </>
  );
};

export default SkipToMainContent;
