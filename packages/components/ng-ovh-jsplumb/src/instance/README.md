# jsplumbInstance directive

Create a jsplumb instance and make possible to create connections between endpoints. This manage default connections between created sources and targets.

## Table of conntent
* [Usage](#usage)
* [Options](#options)
* [Events](#events)
* [Some Magic](#some-magic)

## Usage

jsplumbInstance is restricted to attribute (A):

```html
<div data-jsplumb-instance="options">
    ...
</div>
```

## Options

| Name | Type | Details |
| :--: | :--: | :--: |
| jsplumb-instance | Object | Options of the jsplumb instance (see [jsplumb.getInstance](https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumbInstance.html#method_getInstance) and [jsplumb.Defaults](https://jsplumbtoolkit.com/community/doc/defaults.html) for more informations. |

## Events
### jsplumb.instance.created
Is broadcasted by <code>$rootScope</code> when jsplumb instance creation is finished. Broadcast function callback signature:

| Name | Type | Details |
| :--: | :--: | :--: |
| instance | Object | jsplumb instance created |

### jsplumb.instance.connection
Is broadcasted by <code>$rootScope</code> when a connection is done between two enpoints in jsplumb instance (see [jsplumb.connection event](https://jsplumbtoolkit.com/community/doc/events.html#connectionEvents) for more informations). Broadcast function callback signature:

| Name | Type | Details |
| :--: | :--: | :--: |
| connection | Object | The new Connection created |
| sourceEndpoint | Object | The source Endpoint of the Connection |
| targetEndpoint | Object | The target Endpoint of the Connection |
| instance | Object | The jsplumb instance of the Connection |
| originalEvent | Object | Is defined when connection is done by dragging from endpoint to another. Is `undefined` if connection is made programmatically |

### jsplumb.instance.connection.detached
Is broadcasted by <code>$rootScope</code> when a connection has been removed (see [jsplumb.connectionDetached event](https://jsplumbtoolkit.com/community/doc/events.html#evt-connection-detached) for more informations). Broadcast function callback signature:

| Name | Type | Details |
| :--: | :--: | :--: |
| connection | Object | The Connection detached |
| sourceEndpoint | Object | The source Endpoint of the Connection |
| targetEndpoint | Object | The target Endpoint of the Connection |
| instance | Object | The jsplumb instance of the Connection |
| originalEvent | Object | Is defined when detach is done a jsplumb event (for example when moving single connection to an invalid drop area). Is `undefined` if detach is made programmatically |

### jsplumb.instance.connection.click
Is broadcasted by <code>$rootScope</code> when a connection has been clicked in jsplumb instance (see [jsplumb.click event](https://jsplumbtoolkit.com/community/doc/events.html#evt-click) for more informations). Broadcast function callback signature:

| Name | Type | Details |
| :--: | :--: | :--: |
| connection | Object | The Connection clicked |
| instance | Object | The instance of the Connection |
| originalEvent | Object | The original click event |

## Some Magic

It's not really magic but for better use of the `ovh-angular-jsplumb` component, some method have been added to `jsplumb` instance to extend it.

### revalidateEverything

Clears the offset and size cache of each endpoints end then repaints all connections. Useful when a connection is deleted and endpoints become empty. `repaintEverything` method does not repaint empty endpoints.

### getConnectionBySourceIdAndTargetId

Return a jsplumb connection object by providing a source endpoint id and target endpoint id. This method checks in both direction: from source to target or from target to source. If no connection is found, returns `undefined`.

| Name | Type | Details |
| :--: | :--: | :--: |
| sourceId | String | The source endpoint id |
| targetId | String | The target endpoint id |
