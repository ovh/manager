import AbstractCursorDatagridController from '../abstract-datagrid.controller';

export default class Apiv2ListLayoutCtrl extends AbstractCursorDatagridController {
  $onInit() {
    if (this.columns) {
      this.columns = this.columns.map((column) => {
        if (column.property !== this.linkProperty) return column;
        return {
          ...column,
          template: `<a
              class="oui-button oui-button_link"
              href="{{$ctrl.getResourceLink($row.${this.resourceIdProperty})}}"
          >
              <span data-ng-bind="$row.${column.property}"></span>
          </a>`,
        };
      });
    }
    super.$onInit();
  }
}
