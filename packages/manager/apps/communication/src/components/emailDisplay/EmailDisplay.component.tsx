import { useEffect, useRef, useState } from 'react';
import { OdsSwitch, OdsSwitchItem } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Notification } from '@/data/types';
import HtmlViewer from './htmlViewer/HtmlViewer.component';
import TextViewer from './textViewer/TextViewer.component';

type Format = 'SHORT' | 'LONG' | 'HTML';
type Props = {
  notification: Notification;
  header?: React.ReactNode;
};
const PADDING_OFFSET = 100;

export default function EmailDisplay({ notification, header }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const { t } = useTranslation('detail');
  const [format, setFormat] = useState<Format>('SHORT');
  // If the notification has a short text, we display it as a short text
  useEffect(() => {
    if (notification?.shortText) {
      setFormat('SHORT');
      return;
    }
    setFormat('LONG');
  }, [notification]);

  const updateHeight = () => {
    if (!ref.current) return;
    const { top } = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const remainingHeight = viewportHeight - top - PADDING_OFFSET;
    setHeight(remainingHeight);
  };

  useEffect(() => {
    updateHeight();

    window.addEventListener('resize', updateHeight);
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-6 min-h-[450px]"
      style={{
        height: height ? `${height}px` : 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div className="flex flex-row gap-6 items-center justify-between">
        <div className="flex-grow">{header}</div>
        <OdsSwitch name="format">
          {notification.shortText && (
            <OdsSwitchItem
              isChecked={format === 'SHORT'}
              onClick={() => setFormat('SHORT')}
            >
              {t('format_switch_short')}
            </OdsSwitchItem>
          )}
          <OdsSwitchItem
            isChecked={format === 'LONG'}
            onClick={() => setFormat('LONG')}
          >
            {t('format_switch_long')}
          </OdsSwitchItem>
          {notification.html && (
            <OdsSwitchItem
              isChecked={format === 'HTML'}
              onClick={() => setFormat('HTML')}
            >
              {t('format_switch_html')}
            </OdsSwitchItem>
          )}
        </OdsSwitch>
      </div>
      {notification.html && (
        <HtmlViewer
          html={notification.html}
          visible={format === 'HTML'}
          className="h-full"
        />
      )}
      <style>{`
          .bg-white::part(textarea) {
            background-color: #fefefe;
            height: 100%;
          }
        `}</style>
      {format !== 'HTML' && <TextViewer text={notification.text || ''} />}
    </div>
  );
}
