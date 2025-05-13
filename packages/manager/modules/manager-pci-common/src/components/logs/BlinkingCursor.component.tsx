import style from './blinking-cursor.module.scss';

export function BlinkingCursor() {
  return <i className={style.blinkingCursor} aria-hidden />;
}
