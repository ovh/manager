import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const WebCloudIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="webcloud_icon" data-name="WebCloud icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        {props.title && <title>{props.title}</title>}
        <g id="Color">
            <path className={style.icon_cls_1} d="M19.62,16.12h-7.03c-1.46,0-2.74-.99-3.11-2.39-.33-1.24.09-2.54,1.06-3.34-.09-.83.25-1.66.93-2.19.62-.48,1.44-.63,2.18-.42.95-1.29,2.56-1.89,4.15-1.52,1.73.41,2.97,1.88,3.08,3.63,1.31.55,2.12,1.9,1.95,3.35h0c-.19,1.63-1.57,2.86-3.21,2.87ZM12.97,8.69c-.31,0-.63.1-.88.3-.45.35-.65.94-.51,1.49.05.21-.03.42-.21.54-.8.53-1.17,1.51-.92,2.44.26.97,1.14,1.65,2.15,1.65h7.03c1.13,0,2.09-.85,2.22-1.98h0c.12-1.08-.54-2.09-1.59-2.4-.21-.06-.36-.26-.36-.48v-.11c-.01-1.39-.97-2.59-2.32-2.91-1.29-.3-2.62.26-3.29,1.41-.13.23-.42.31-.66.19-.2-.1-.43-.16-.65-.16Z" />
        </g>
        <g>
            <path className={style.icon_cls_1} d="M30.1,23.96H1.9c-1.02,0-1.85-.83-1.85-1.85V3.9C.04,2.88.88,2.05,1.9,2.05h28.21c1.02,0,1.85.83,1.85,1.85v18.21c0,1.02-.83,1.85-1.85,1.85ZM1.9,3.05c-.47,0-.85.38-.85.85v18.21c0,.47.38.85.85.85h28.21c.47,0,.85-.38.85-.85V3.9c0-.47-.38-.85-.85-.85H1.9Z" />
            <rect className={style.icon_cls_1} x=".71" y="19.18" width="30.57" height="1" />
            <rect className={style.icon_cls_1} x="7.67" y="28.95" width="16.66" height="1" />
            <g>
                <rect className={style.icon_cls_1} x="8.23" y="25.96" width="6.23" height="1" transform="translate(-17.21 30.13) rotate(-74.13)" />
                <rect className={style.icon_cls_1} x="20.16" y="23.34" width="1" height="6.23" transform="translate(-6.45 6.66) rotate(-15.88)" />
            </g>
        </g>
    </svg>
);

export default WebCloudIcon;
