const getIcon = (iconClass:string ): JSX.Element => {
  return <span className={`${iconClass} text-indigo-800 mr-1`} aria-hidden="true" />;}

export default getIcon;
