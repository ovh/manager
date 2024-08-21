import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const HostedPrivateCloudIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="hostedprivatecloud_icon" data-name="HostedPrivateCloud icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props} >
        {props.title && <title>{props.title}</title>}
        <g id="Color">
            <path className={style.icon_cls_1} d="M24.71,27.6H7.27c-3.27-.01-6.16-2.23-7.01-5.39-.78-2.92.31-5.99,2.72-7.76-.36-1.94.39-3.93,1.96-5.16,1.49-1.16,3.51-1.43,5.24-.73,2.12-3.25,6.01-4.82,9.83-3.92,4.12.97,7.03,4.59,7.1,8.81,3.2,1.12,5.21,4.3,4.82,7.7-.42,3.67-3.53,6.45-7.23,6.45ZM8.21,9.18c-.94,0-1.88.31-2.65.9-1.35,1.05-1.95,2.8-1.53,4.46.05.21-.03.42-.21.54-2.25,1.49-3.29,4.25-2.59,6.87.73,2.73,3.22,4.64,6.04,4.65h17.44c3.19,0,5.87-2.4,6.23-5.57h0c.35-3.04-1.53-5.88-4.47-6.74-.21-.06-.36-.26-.36-.48v-.28c-.03-3.79-2.64-7.05-6.33-7.93-3.53-.83-7.14.71-8.98,3.84-.13.23-.42.31-.66.19-.61-.31-1.28-.47-1.95-.47Z" />
        </g>
        <path className={style.icon_cls_1} d="M20.29,24.77h-8.53c-.89,0-1.61-.72-1.61-1.61v-6.55c0-.89.72-1.61,1.61-1.61h8.53c.89,0,1.61.72,1.61,1.61v6.55c0,.89-.72,1.61-1.61,1.61ZM11.76,15.99c-.34,0-.61.28-.61.61v6.55c0,.34.28.61.61.61h8.53c.34,0,.61-.28.61-.61v-6.55c0-.34-.28-.61-.61-.61h-8.53Z" />
        <path className={style.icon_cls_1} d="M19.97,15.47h-1v-2.11c0-1.62-1.32-2.94-2.94-2.94s-2.94,1.32-2.94,2.94v2.11h-1v-2.11c0-2.17,1.77-3.94,3.94-3.94s3.94,1.77,3.94,3.94v2.11Z" />
        <rect className={style.icon_cls_1} x="15.53" y="18.23" width="1" height="2.39" />
    </svg>
)

export default HostedPrivateCloudIcon;