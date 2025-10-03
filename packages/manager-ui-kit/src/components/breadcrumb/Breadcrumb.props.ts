export interface BreadcrumbProps {
  /** application name define in the shell */
  appName: string;
  /** root label step */
  rootLabel: string;
  /** hides app name from breadcrumb */
  hideRootLabel?: boolean;
}
