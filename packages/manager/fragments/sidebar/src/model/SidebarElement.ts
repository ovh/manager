export class SidebarElement {
  label: string;

  subitems?: SidebarElement[];

  href?: string;

  constructor({
    label,
    subitems,
    href,
  }: {
    label: string;
    subitems?: SidebarElement[];
    href?: string;
  }) {
    this.label = label;
    this.subitems = subitems;
    this.href = href;
  }
}

export default SidebarElement;
