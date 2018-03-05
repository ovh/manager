# angular-uirouter-title

AngularJS module for updating browser title based on the current ui-router state.

## Getting Started

When declaring your ui-router state, you can add a custom $title :

```javascript
$stateProvider.state("app.item", {
    url: "/app/item",
    resolve: {
        $title: function ($stateParams, $translate) {
            return $translate.instant("item_description_", { name: $stateParams.id });
        }
    }
});
```

## Documentation

You can use:
------------

  - `grunt` : to build.
  - `grunt watch` : will rebuild your project when a file change. Also re-launch Karma when a spec file change.
  - `grunt test` : to test specs files with Karma/Jasmine.
  - `grunt release --type=major|minor|patch` : to release your module.
