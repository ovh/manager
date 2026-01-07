import { useEffect, useMemo, useRef, useState } from 'react';
import { Switch, SwitchItem } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Notification } from '@/data/types';
import HtmlViewer from './htmlViewer/HtmlViewer.component';
import TextViewer from './textViewer/TextViewer.component';
import { PADDING_OFFSET, EmailFormat } from './emailDisplay.constants';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

type Props = {
  notification: Notification;
  header?: React.ReactNode;
};

export default function EmailDisplay({ notification, header }: Props) {
  const { t } = useTranslation('detail');
  const [format, setFormat] = useState<EmailFormat>('SHORT');
  const { trackClick } = useTracking();

  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const hasText = useMemo(() => {
    return notification.shortText || notification.text || notification.html;
  }, [notification]);

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
    if (!hasText) return;
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

  if (!hasText) {
    return null;
  }

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
        <Switch
          value={format}
          onValueChange={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: [`format-email:${format.toLowerCase()}`],
              subApp: TrackingSubApps.Communications,
            });
          }}
        >
          {notification.shortText && (
            <SwitchItem
              value="SHORT"
              onClick={() => setFormat('SHORT')}
            >
              {t('format_switch_short')}
            </SwitchItem>
          )}
          <SwitchItem
            value="LONG"
            onClick={() => setFormat('LONG')}
          >
            {t('format_switch_long')}
          </SwitchItem>
          {notification.html && (
            <SwitchItem
              value="HTML"
              onClick={() => setFormat('HTML')}
            >
              {t('format_switch_html')}
            </SwitchItem>
          )}
        </Switch>
      </div>
      {notification.html && (
        <HtmlViewer
          html={notification.html}
          isVisible={format === 'HTML'}
          className="h-full"
        />
      )}
      {format !== 'HTML' && <TextViewer text={notification.text || ''} />}
    </div>
  );
}
