import { UXComponent, IUxComponent } from './component';

interface ISidebar extends IUxComponent {
  enableToggle: () => void;
  disableToggle: () => void;
  isToggleAllowed: () => boolean;
}

export default class Sidebar extends UXComponent implements ISidebar {
  private allowToggle?: boolean;

  constructor() {
    super({ visible: false });
    this.allowToggle = true;
  }

  public isToggleAllowed(): boolean {
    return this.allowToggle;
  }

  public enableToggle(): void {
    this.allowToggle = true;
  }

  public disableToggle(): void {
    this.allowToggle = false;
  }
}
