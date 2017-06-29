# responsive-switch

Create a container to add pages into. It manages the display and the animations of the pages.

## Table of conntent

* [Directive Info](directive-info)
* [Options](#options)
* [Events](#events)

## Directive Info

This directive can be only used as attribute.

## Options

Prefix the following options name by `data-responsive-switch-`.

| Name | Type | Details |
| :--: | :--: | :--: |
| matchMedia | String | A media query that determines a mobile. |
| activePageIndex | Number | The index of the current active page. Change this value to automatically switch the pages. It must be incremented by one. For example : from 0 to 1 but not from 0 to 2. |
| pagesWidth | Number | Width (in px) of child pages. |
| forceMode | String | Force display mode to be switch or sidebyside (the two display modes available). |

## Events

### responsive.switch.created

Is broadcasted by `$rootScope` when responsive-switch creation is finished. Broadcast function callback signature :

| Name | Type | Details |
| :--: | :--: | :--: |
| pageSwitcher | Object | An object exposing functions getDisplayMode() (that returns the display mode) and getActivePage() (that returns the active page index) |
