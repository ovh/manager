import React, {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocalStorage } from 'react-use';
import styles from './virtualAgentStyles.module.scss';

interface VirtualAgentProps {
  name: string;
  title: string;
  url: string;
  agentStarted?: boolean;
  useStorage?: boolean; // Remembers last user choice in local storage
  buttonColor?: string;
  headerColor?: string;
  buttonIcon?: string;
  customStyles?: CSSProperties;
  onClose?: () => void;
  onStart?: () => void;
  onReduce?: () => void;
}

const VirtualAgent: React.FC<ComponentProps<VirtualAgentProps>> = (
  props: VirtualAgentProps,
): JSX.Element => {
  const {
    name,
    title,
    url,
    useStorage,
    buttonColor,
    headerColor,
    agentStarted = true,
    buttonIcon = 'oui-icon-chat',
    customStyles,
    onClose,
    onStart,
    onReduce,
  } = props;
  const dialog = useRef(null);
  const mainFrame = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(agentStarted);
  const [reduced, setReduced] = useState(false);
  const [storage, setStorage, removeStorage] = useLocalStorage<string>(
    `virtual_agent_${name}_state`,
  );
  const tabletBreakpoint = 1200;
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(max-width: ${tabletBreakpoint}px)`).matches,
  );

  const toggle = () => {
    setReduced(!reduced);
    if (onReduce) onReduce();
  };
  const stop = () => {
    setStarted(false);
    setReduced(true);
    if (onClose) onClose();
  };

  const start = (startedValue: boolean, reducedValue: boolean) => {
    setStarted(startedValue);
    setReduced(reducedValue);
    if (onStart) onStart();
  };

  const setCustomStyleOnMobile = (
    mobileColor: string,
    defaultColor = 'transparent',
  ) => {
    if (isMobile) {
      return {
        background: mobileColor,
      };
    }

    return { background: defaultColor };
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${tabletBreakpoint}px)`);
    const handleBreakpointChange = (media: MediaQueryListEvent) => {
      setIsMobile(media.matches);
    };

    mediaQuery.addEventListener('change', (media) =>
      handleBreakpointChange(media),
    );

    return mediaQuery.removeEventListener('change', handleBreakpointChange);
  }, []);

  useLayoutEffect(() => {
    if (useStorage) {
      if (storage) {
        start(
          storage === 'started' || storage === 'reduced',
          storage === 'reduced',
        );
      } else {
        start(agentStarted, !agentStarted);
      }
    } else {
      start(agentStarted, !agentStarted);
    }
  }, []);

  useLayoutEffect(() => {
    if (agentStarted) {
      start(agentStarted, false);
    }
  }, [agentStarted]);

  useLayoutEffect(() => {
    if (started && !reduced) {
      dialog.current.show();
      // This next line is for the focus when clicking with the keyboard
      // The native dialog API seem to focus right with the mouse click but not with the keyboard
      // To ensure full accessibility of the container, we should trigger the focus inside
      // the dialog whenever it opens.
      mainFrame.current.contentWindow.focus();
      setStorage('started');
    } else {
      dialog.current.close();

      if (started && reduced) setStorage('reduced');
      else removeStorage();
    }
  }, [reduced, started]);

  return (
    <div
      style={customStyles}
      className={`${
        !reduced
          ? styles.virtualAgent
          : `${styles.virtualAgent} ${styles.fitHeight}`
      } d-flex flex-column justify-content-end`}
    >
      <dialog
        ref={dialog}
        className={`w-100 p-0 border-0 ${styles.dialog}`}
        title={name}
      >
        <article
          className={`${styles.dialog_content} d-flex h-100 flex-column`}
        >
          <header
            style={{
              background: headerColor,
            }}
            title={title}
            className={
              headerColor
                ? styles.header
                : `${styles.header} oui-background-p-500`
            }
          >
            <button
              className="oui-button oui-icon oui-icon-close d-xl-none d-flex"
              onClick={() => toggle()}
              title={`Icon button that toggles ${title}`}
            >
              <span className="sr-only">{`Toggles ${title}`}</span>
            </button>
            <h3 className={`${styles.dialogTitle} oui-color-p-000`}>{title}</h3>
          </header>
          <div className={styles.main}>
            {/* Destroy Iframe if not started */}
            {started && (
              <iframe
                ref={mainFrame}
                title={`${title} main view`}
                src={url}
                className={`${styles.main_frame} w-100 h-100 border-0`}
                sandbox="allow-scripts allow-top-navigation allow-forms"
              ></iframe>
            )}
          </div>
        </article>
      </dialog>

      {started && (
        <div
          role="group"
          className={`${styles.group} d-xl-flex justify-content-end`}
          style={setCustomStyleOnMobile(headerColor)}
        >
          <button
            onClick={() => toggle()}
            className={`${styles.group_arrow_button} oui-button`}
            title={`Toggle ${title}`}
          >
            <span className="oui-icon oui-icon-chevron-up"></span>
            <span className="sr-only">{`Toggles ${title}`}</span>
          </button>
          <button
            onClick={() => toggle()}
            style={setCustomStyleOnMobile('transparent', buttonColor)}
            className={`${styles.group_toggle_button} oui-button oui-button_primary`}
            title={`Toggle ${title}`}
          >
            <span
              className={
                !reduced ? 'oui-icon oui-icon-close' : `oui-icon ${buttonIcon}`
              }
            ></span>
            <span className="sr-only">{`Toggle ${title}`}</span>
          </button>
          {reduced && (
            <button
              title={`Close ${title}`}
              className={`${styles.group_close_button} oui-button p-0`}
              onClick={() => stop()}
            >
              <span className="oui-icon oui-icon-close m-auto"></span>
              <span className="sr-only">{`Close ${title}`}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualAgent;
