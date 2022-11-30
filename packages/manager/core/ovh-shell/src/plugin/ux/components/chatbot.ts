import { UXComponent, IUxComponent } from './component';

interface IChatbot extends IUxComponent {
  isReduced: () => boolean;
  reduce: () => void;
}

export default class Chatbot extends UXComponent implements IChatbot {
  private reduced?: boolean = false;

  constructor() {
    super({ visible: false });
  }

  show(): void {
    super.show();
    this.reduced = false;
  }

  reduce(): void {
    this.reduced = true;
  }

  hide(): void {
    super.hide();
    this.reduced = false;
  }

  isReduced(): boolean {
    return this.reduced;
  }
}
