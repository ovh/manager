# jsplumbEndpoint directive

Create a jsplumb endpoint on element (source and/or target). See [elements as sources & targets](http://www.jsplumb.org/doc/connections.html#sourcesandtargets) for more informations.

## Table of conntent
* [How it works ?](#how-it-works-)
* [Usage](#usage)
* [Options](#options)
* [Events](#events)

## How it works ?

`jsplumbEndpoint` requires [`jsplumbInstance`](https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumbInstance.html) directive to work. `ovh-angular-jsplumb` only use makeSource and makeTarget (see [elements as sources & targets](https://jsplumbtoolkit.com/community/doc/connections.html#sourcesandtargets) for more informations) to create endpoints. So if you don't provide `source` or `target` options, `jsplumbEndpoint` won't do anything.

By default `jsplumbInstance` will create connections provided on endpoint creation. The if you want to add or remove new connections, simply update `jsplumb-endpoint-connection-ids` list and connections will be added or removed by directive.

## Usage

First, create `jsplumbInstance` and then create `jsplumbEndpoint`. `jsplumbEndpoint` is restricted to attribute (A):

```html
<div data-jsplumb-instance="options">
    <div data-jsplumb-endpoint id="ep1">
        ...
    </div>
</div>
 ```

## Options

| Name | Type | Details |
| :--: | :--: | :--: |
| id | String | Id of the DOM element. Will be used to search for connections and endpoints. |
| jsplumb-endpoint-enabled | Boolean | Flag indicating if endpoint is enabled or not. |
| jsplumb-endpoint-source-options | Object | Options of the endpoint source. If not set, endpoint won't be a source. |
| jsplumb-endpoint-target-options | Object | Options of the endpoint target. If not set, endpoint won't be a target. |
| jsplumb-endpoint-connection-ids | Array | List of the connection ids of given endpoint. |

## Events
#### jsplumb.endpoint.created
Is broadcasted by <code>$rootScope</code> when jsplumb endpoint creation is done. Parent `jsplumbInstance` directive will create automatically connections between endpoints. Broadcast function callback signature:

| Name | Type | Details |
| :--: | :--: | :--: |
| endpointId | String | Id of the element |
| connectionIds | Array | List of the connections ids of the endpoint |
| instance | Object | jsplumb instance where endpoint is created |
