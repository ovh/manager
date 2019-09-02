import $ from 'jquery';

export const TUC_UI_SORTABLE_HELPERS = {
  variableHeightTolerance(e, ui) {
    const container = $(this);
    const placeholder = container.children('.ui-sortable-placeholder:first');
    const helpHeight = ui.helper.outerHeight();
    const helpTop = ui.position.top;
    const helpBottom = helpTop + helpHeight;

    container.children().each(function () {
      const item = $(this);

      if (!item.hasClass('ui-sortable-helper') && !item.hasClass('ui-sortable-placeholder')) {
        const itemHeight = item.outerHeight();
        const itemTop = item.position().top;
        const itemBottom = itemTop + itemHeight;
        let tolerance;
        let distance;

        if ((helpTop > itemTop) && (helpTop < itemBottom)) {
          tolerance = Math.min(helpHeight, itemHeight) / 2;
          distance = helpTop - itemTop;

          if (distance < tolerance) {
            placeholder.insertBefore(item);
            container.sortable('refreshPositions');
            return false;
          }
        } else if ((helpBottom < itemBottom) && (helpBottom > itemTop)) {
          tolerance = Math.min(helpHeight, itemHeight) / 2;
          distance = itemBottom - helpBottom;

          if (distance < tolerance) {
            placeholder.insertAfter(item);
            container.sortable('refreshPositions');
            return false;
          }
        }
      }

      return null;
    });
  },
};

export default { TUC_UI_SORTABLE_HELPERS };
