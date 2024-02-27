import React from "react";
import style from '../index.module.scss';

const getIcon = (iconClass:string ): JSX.Element => {
  return <span className={`${iconClass}  ${style.iconStyleColor} mr-1`} aria-hidden="true" />;}

export default getIcon;
