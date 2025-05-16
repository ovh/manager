interface ISkipToTheMainContentComponent {
  skip(): void;
  onSkip(callback: CallableFunction): void;
}

export class UxSkipToTheMainContent implements ISkipToTheMainContentComponent {
  protected skipListeners: CallableFunction[] = [];

  skip(): void {
    this.triggerSkipListeners();
  }

  onSkip(callback: CallableFunction): void {
    this.skipListeners.push(callback);
  }

  protected triggerSkipListeners() {
    this.skipListeners.forEach((listener) => {
      listener();
    });
  }
}

export default UxSkipToTheMainContent;
