/**
 * Vanilla JS Modal compatible with Bootstrap
 * Inspired by https://github.com/KaneCohen/modal-vanilla
 */
const templates = {
  container: '<div class="modal"></div>',
  dialog: '<div class="modal-dialog"></div>',
  content: '<div class="modal-content oui-modal oui-modal_shadow"></div>',
  header: '<div class="modal-header"></div>',
  headerClose:
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>',
  body: '<div class="oui-modal__body oui-modal__body_no-icon"></div>',
  footer: '<div class="modal-footer"></div>',
  backdrop: '<div class="modal-backdrop"></div>',
};

const buildTemplate = (html: string): HTMLElement => {
  const template = document.createElement('template');
  template.innerHTML = html;

  return <HTMLElement>(
    document.importNode(template.content, true).firstElementChild
  );
};

export interface IModalElements {
  container?: HTMLElement;
  dialog?: HTMLElement;
  content?: HTMLElement;
  body?: HTMLElement;
  backdrop?: HTMLElement;
  appendTo?: HTMLElement;
}

export interface IModalOptions {
  appendTo?: string;
  animate?: boolean;
  animateClass?: string;
  animateInClass?: string;
  content?: Node | string;
  className?: string;
  size?: string;
}

export class UxModal {
  private elements: IModalElements = {};

  private options: IModalOptions;

  static defaults: IModalOptions = {
    appendTo: 'body',
    animate: true,
    animateClass: 'fade',
    animateInClass: 'in',
    content: null,
    className: null,
    size: null,
  };

  constructor(options: IModalOptions = {}) {
    this.options = { ...UxModal.defaults, ...options };

    this.elements.appendTo = document.querySelector(this.options.appendTo);

    this.render();
  }

  private render(): void {
    this.elements.container = buildTemplate(templates.container);
    this.elements.dialog = buildTemplate(templates.dialog);
    this.elements.content = buildTemplate(templates.content);
    this.elements.body = buildTemplate(templates.body);

    this.elements.content.appendChild(this.elements.body);
    this.elements.dialog.appendChild(this.elements.content);
    this.elements.container.appendChild(this.elements.dialog);

    if (this.options.content) {
      this.elements.body.append(this.options.content);
    }
  }

  show(): UxModal {
    document.body.classList.add('modal-open');

    this.elements.container.style.display = 'block';
    this.elements.appendTo.appendChild(this.elements.container);

    this.elements.backdrop = buildTemplate(templates.backdrop);
    this.elements.appendTo.appendChild(this.elements.backdrop);

    if (this.options.className) {
      this.elements.container.classList.add(this.options.className);
    }

    if (this.options.size) {
      this.elements.dialog.classList.add(`modal-${this.options.size}`);
    }

    if (this.options.animate) {
      this.elements.container.classList.add(
        this.options.animateClass,
        this.options.animateInClass,
      );
      this.elements.backdrop.classList.add(
        this.options.animateClass,
        this.options.animateInClass,
      );
    }

    return this;
  }

  hide(): UxModal {
    document.body.classList.remove('modal-open');
    this.elements.container.style.display = 'none';
    this.elements.backdrop.parentNode.removeChild(this.elements.backdrop);
    this.elements.container.parentNode.removeChild(this.elements.container);

    return this;
  }
}

export default UxModal;
