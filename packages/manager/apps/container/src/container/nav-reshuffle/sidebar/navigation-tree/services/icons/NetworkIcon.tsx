import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const NetworkIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="network_icon" data-name="Network icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        {props.title && <title>{props.title}</title>}
        <path className={style.icon_cls_1} d="M4.42,20.4C1.99,20.4.01,18.43.01,16s1.98-4.4,4.4-4.4,4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM4.42,12.6c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <path className={style.icon_cls_1} d="M4.42,31.99C1.99,31.99.01,30.01.01,27.58s1.98-4.4,4.4-4.4,4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM4.42,24.18c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <path className={style.icon_cls_1} d="M4.42,8.82C1.99,8.82.01,6.85.01,4.42S1.99.01,4.42.01s4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM4.42,1.01c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <path className={style.icon_cls_1} d="M27.58,20.4c-2.43,0-4.4-1.98-4.4-4.4s1.98-4.4,4.4-4.4,4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM27.58,12.6c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <path className={style.icon_cls_1} d="M27.58,8.82c-2.43,0-4.4-1.98-4.4-4.4S25.15.01,27.58.01s4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM27.58,1.01c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <path className={style.icon_cls_1} d="M27.58,31.99c-2.43,0-4.4-1.98-4.4-4.4s1.98-4.4,4.4-4.4,4.4,1.98,4.4,4.4-1.98,4.4-4.4,4.4ZM27.58,24.18c-1.88,0-3.4,1.53-3.4,3.4s1.53,3.4,3.4,3.4,3.4-1.53,3.4-3.4-1.53-3.4-3.4-3.4Z" />
        <g>
            <rect className={style.icon_cls_1} x="2.1" y="15.5" width="27.79" height="1" transform="translate(-6.18 20.49) rotate(-56.43)" />
            <rect className={style.icon_cls_1} x="8.32" y="15.5" width="15.36" height="1" />
            <rect className={style.icon_cls_1} x="15.5" y="2.1" width="1" height="27.79" transform="translate(-6.18 11.51) rotate(-33.54)" />
        </g>
    </svg>
);

export default NetworkIcon;
