import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const SunriseIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="sunrise_icon" data-name="Sunrise icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        {props.title && <title>{props.title}</title>}
        <path className={style.icon_cls_1} d="M16,30.98c-.06,0-.13-.01-.19-.04l-10.62-4.33c-.19-.08-.31-.26-.31-.46v-4.64l-4.49-1.79c-.16-.06-.28-.21-.31-.38-.03-.17.04-.35.17-.46l4.8-4.1s.09-.07.15-.09l4.12-1.54.35.94-4.03,1.51-4.1,3.51,4.03,1.61c.19.08.31.26.31.46v4.65l10.12,4.12,10.12-4.12v-4.65c0-.2.12-.39.31-.46l4.03-1.61-4.1-3.51-4.03-1.51.16-.44-.35-.38c.14-.11.37-.19.54-.12l4.12,1.54c.05.02.11.05.15.09l4.8,4.1c.13.11.2.29.17.46-.03.17-.15.32-.31.38l-4.49,1.79v4.64c0,.2-.12.39-.31.46l-10.62,4.33c-.06.02-.12.04-.19.04Z" />
        <g>
            <path className={style.icon_cls_1} d="M16.5,30.48h-1v-11.46c0-.2.12-.39.31-.46.19-.08.41-.03.55.12l4.19,4.38,5.88-2.35.37.93-6.19,2.47c-.19.07-.41.03-.55-.12l-3.56-3.72v10.21Z" />
            <path className={style.icon_cls_1} d="M11.58,24.14c-.06,0-.12-.01-.19-.04l-6.19-2.47.37-.93,5.88,2.35,4.19-4.38.72.69-4.42,4.62c-.1.1-.23.15-.36.15Z" />
        </g>
        <rect className={style.icon_cls_1} x="15.5" y="1.52" width="1" height="1.96" />
        <g>
            <rect className={style.icon_cls_1} x="7.42" y="8.11" width="1.96" height="1" />
            <rect className={style.icon_cls_1} x="22.62" y="8.11" width="1.96" height="1" />
        </g>
        <g>
            <rect className={style.icon_cls_1} x="19.84" y="3.8" width="2.03" height="1" transform="translate(3.07 16.01) rotate(-45)" />
            <rect className={style.icon_cls_1} x="10.64" y="3.29" width="1" height="2.03" transform="translate(.22 9.14) rotate(-45)" />
        </g>
        <path className={style.icon_cls_1} d="M12.38,17.6l-.99-.16.17-1.08-3.6-3.58c-.13-.13-.18-.33-.12-.51s.21-.31.4-.34l5.02-.78,2.29-4.54c.08-.17.26-.27.45-.27h0c.19,0,.36.11.45.27l2.29,4.53,5.02.78c.19.03.34.16.4.34.06.18.01.38-.12.51l-3.6,3.58.18,1.08-.99.16-.22-1.33c-.03-.16.03-.32.14-.43l3.08-3.07-4.3-.66c-.16-.02-.3-.12-.37-.27l-1.96-3.88-1.96,3.88c-.07.14-.21.24-.37.27l-4.3.67,3.09,3.06c.11.11.17.27.14.43l-.21,1.33Z" />
        <path className={style.icon_cls_1} d="M16,19.52c-.06,0-.12,0-.17-.03l-10.62-3.87.34-.94,10.44,3.81,10.44-3.81.34.94-10.62,3.87c-.06.02-.11.03-.17.03Z" />
    </svg>
);

export default SunriseIcon;
