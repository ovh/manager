import { Region } from "@ovh-ux/manager-config";

export type HelpPath = Record<
Region,
{
  [subsidiaryKey: string]: string;
}
>;
