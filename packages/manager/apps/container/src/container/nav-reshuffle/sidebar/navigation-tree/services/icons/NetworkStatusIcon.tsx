import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const NetworkStatusIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="NetworkStatus_icon" data-name="NetworkStatus icon" xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 19" >
        {props.title && <title>{props.title}</title>}
        <path className={style.icon_cls_1} d="M10.9177 0.602789C10.7593 0.236867 10.3987 0 10 0C9.60127 0 9.24065 0.236868 9.08227 0.602791L2.41809 16H0.593932C0.265912 16 0 16.2659 0 16.5939V17.5946C0 17.9226 0.265912 18.1885 0.593932 18.1885H19.4061C19.7341 18.1885 20 17.9226 20 17.5946V16.5939C20 16.2659 19.7341 16 19.4061 16H17.5819L10.9177 0.602789ZM13.2385 11L12.3729 9H7.62711L6.76147 11H13.2385ZM14.1042 13H5.89584L4.59738 16H15.4026L14.1042 13ZM10 3.51756L11.5073 7H8.49274L10 3.51756Z" />
    </svg>
)

export default NetworkStatusIcon;
