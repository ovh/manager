import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'manager-breadcrumb',
  styleUrl: 'breadcrumb.css',
  shadow: true
})
export class Breadcrumb {
  @Prop({ reflect: true }) elements: BreadcrumbElement[] = [];

  render() {
    return (
      <ul>
        {
          this.elements.map((element, index) =>
            <li key={element.id}>
              {
                element.url && !element.active && index !== this.elements.length - 1 ?
                <a href={element.url}>{element.name}</a> :
                <span>{element.name}</span>
              }
            </li>
          )
        }
      </ul>)
  }
}
