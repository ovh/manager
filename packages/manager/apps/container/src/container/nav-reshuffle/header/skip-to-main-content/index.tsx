import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { useShell } from '@/context';
import { useTranslation } from 'react-i18next';

export interface Props {
  iframeRef: React.MutableRefObject<HTMLIFrameElement>;
}

const SkipToMainContent = (props: Props) => {

  const { iframeRef } = props;
  const { isFirstTabDone, setIsFirstTabDone, firstFocusableElement } = useProductNavReshuffle();
  const [isButtonDisplayed, setIsButtonDisplayed] = useState(false);
  const buttonRef = useRef<HTMLOsdsButtonElement>(null);
  const shell = useShell();
  const { t } = useTranslation('sidebar');

  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (isFirstTabDone === true) return;
    if (event.key === "Tab") {
      setIsButtonDisplayed(true);
      setIsFirstTabDone(true);
      event.stopPropagation();
      event.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [setIsFirstTabDone, isFirstTabDone]);

  useEffect(() => {
    if (isButtonDisplayed) buttonRef?.current?.focus();
  }, [isButtonDisplayed])

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && iframeRef?.current) {
      iframeRef.current.focus();
      shell.emitEvent('skipToTheMainContent');
    }
    if (e.key === "Tab" && firstFocusableElement?.current) {
      firstFocusableElement.current.focus();
    }
    e.preventDefault(); 
    e.stopPropagation();
  }
  
  const handleBlur = (e: any) => {
    setIsButtonDisplayed(false);
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <OsdsButton
      data-testid="skipToMainContent"
      variant={ODS_BUTTON_VARIANT.stroked}
      size={ODS_BUTTON_SIZE.sm}
      color={ODS_THEME_COLOR_INTENT.primary}
      role="button"
      ref={buttonRef}
      onKeyDown={(e: any) => handleKeyDown(e)}
      onBlur={(e: any) => handleBlur(e)}
      className={isButtonDisplayed ? 'flex': 'hidden'}
    >
      {t('sidebar_skip_to_the_main_content')}
    </OsdsButton>
  );
}

export default SkipToMainContent