## Modules

<dl>
<dt><a href="#module_Iconographer">Iconographer</a></dt>
<dd><p>Iconographer library</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Iconographer">Iconographer</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Iconographer class for processing icons and managing storage</p>
</dd>
<dt><a href="#MemoryStorageInterface">MemoryStorageInterface</a> ⇐ <code><a href="#StorageInterface">StorageInterface</a></code></dt>
<dd><p>Icon storage interface for in-memory storage of icons</p>
</dd>
<dt><a href="#StorageInterface">StorageInterface</a></dt>
<dd><p>Storage interface for storing icons</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#fetchData">fetchData(url)</a> ⇒ <code>Promise.&lt;Buffer&gt;</code></dt>
<dd><p>Fetch data from a URL and return a buffer</p>
</dd>
<dt><a href="#fetchText">fetchText(url)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Fetch text from a URL</p>
</dd>
<dt><a href="#setDataFetcher">setDataFetcher(fn)</a></dt>
<dd><p>Set the data fetching function</p>
</dd>
<dt><a href="#setTextFetcher">setTextFetcher(fn)</a></dt>
<dd><p>Set the text fetching function</p>
</dd>
<dt><a href="#getIcon">getIcon(url)</a> ⇒ <code>Promise.&lt;(ProcessedIcon|null)&gt;</code></dt>
<dd><p>Get an icon from a page
Resolves the URL before processing</p>
</dd>
<dt><a href="#getIconForURL">getIconForURL(url)</a> ⇒ <code>Promise.&lt;(Buffer|null)&gt;</code></dt>
<dd><p>Get the icon data from a page URL</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ProcessedIcon">ProcessedIcon</a> : <code>Object</code></dt>
<dd><p>Processed icon information</p>
</dd>
<dt><a href="#Entry">Entry</a> : <code>Object</code></dt>
<dd><p>Buttercup Entry</p>
</dd>
</dl>

<a name="module_Iconographer"></a>

## Iconographer
Iconographer library

<a name="Iconographer"></a>

## Iconographer ⇐ <code>EventEmitter</code>
Iconographer class for processing icons and managing storage

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Iconographer](#Iconographer) ⇐ <code>EventEmitter</code>
    * [.downloadChannel](#Iconographer+downloadChannel) : <code>Channel</code>
    * [.downloadTimeout](#Iconographer+downloadTimeout) : <code>Number</code>
    * [.queue](#Iconographer+queue) : <code>ChannelQueue</code>
    * [.storageInterface](#Iconographer+storageInterface) : [<code>StorageInterface</code>](#StorageInterface)
    * [.storeChannel](#Iconographer+storeChannel) : <code>Channel</code>
    * [.emitAsync(key, ...args)](#Iconographer+emitAsync)
    * [.fetchIconDataForPage(pageURL)](#Iconographer+fetchIconDataForPage) ⇒ <code>Promise.&lt;(BuffProcessedIconer\|null)&gt;</code>
    * [.getIconForEntry(buttercupEntry)](#Iconographer+getIconForEntry) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
    * [.getIconForURL(pageURL)](#Iconographer+getIconForURL) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
    * [.processIconForEntry(buttercupEntry)](#Iconographer+processIconForEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.processIconForURL(pageURL)](#Iconographer+processIconForURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.removeIconForEntry(buttercupEntry)](#Iconographer+removeIconForEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.removeIconForURL(pageURL)](#Iconographer+removeIconForURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * ["iconAdded"](#Iconographer+event_iconAdded)
    * ["iconFetchFailed"](#Iconographer+event_iconFetchFailed)
    * ["iconRemoved"](#Iconographer+event_iconRemoved)

<a name="Iconographer+downloadChannel"></a>

### iconographer.downloadChannel : <code>Channel</code>
The download channel, for queuing downloads

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+downloadTimeout"></a>

### iconographer.downloadTimeout : <code>Number</code>
The timeout for downloading icons in milliseconds

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+queue"></a>

### iconographer.queue : <code>ChannelQueue</code>
Get the channel queue instance

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+storageInterface"></a>

### iconographer.storageInterface : [<code>StorageInterface</code>](#StorageInterface)
Get the storage interface instance

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+storeChannel"></a>

### iconographer.storeChannel : <code>Channel</code>
The store channel, for storing data

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+emitAsync"></a>

### iconographer.emitAsync(key, ...args)
Emit an event asynchronously

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The event key |
| ...args | <code>\*</code> | The event arguments |

<a name="Iconographer+fetchIconDataForPage"></a>

### iconographer.fetchIconDataForPage(pageURL) ⇒ <code>Promise.&lt;(BuffProcessedIconer\|null)&gt;</code>
Download icon data from a page

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;(BuffProcessedIconer\|null)&gt;</code> - A promise that resolves with either icon
 info, or null  

| Param | Type | Description |
| --- | --- | --- |
| pageURL | <code>String</code> | The page URL |

<a name="Iconographer+getIconForEntry"></a>

### iconographer.getIconForEntry(buttercupEntry) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
Get icon data for a buttercup entry
Requires that the icon was fetched beforehand

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;(Buffer\|null)&gt;</code> - A promise that resolves with the buffered
 image data or null if there is no such icon  
**See**: getIconForURL  

| Param | Type | Description |
| --- | --- | --- |
| buttercupEntry | [<code>Entry</code>](#Entry) | The Buttercup entry instance |

<a name="Iconographer+getIconForURL"></a>

### iconographer.getIconForURL(pageURL) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
Retrieve icon data for a specific page URL
Requires that the icon was fetched beforehand

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;(Buffer\|null)&gt;</code> - A promise that resolves with the buffered
 image data or null if there is no such icon  
**See**: processIconForURL  

| Param | Type | Description |
| --- | --- | --- |
| pageURL | <code>String</code> | The page URL |

<a name="Iconographer+processIconForEntry"></a>

### iconographer.processIconForEntry(buttercupEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Process the fetching of an icon for a Buttercup entry

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - A promise that resolves with boolean true if the icon was
 successfully processed or false if it was not  

| Param | Type | Description |
| --- | --- | --- |
| buttercupEntry | [<code>Entry</code>](#Entry) | The Buttercup entry instance |

<a name="Iconographer+processIconForURL"></a>

### iconographer.processIconForURL(pageURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Process the fetching of an icon for a page URL

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - A promise that resolves with boolean true if an icon was
 successfully fetched or false if none was found  
**Emits**: [<code>iconAdded</code>](#Iconographer+event_iconAdded), [<code>iconFetchFailed</code>](#Iconographer+event_iconFetchFailed)  

| Param | Type | Description |
| --- | --- | --- |
| pageURL | <code>String</code> | The page URL |

<a name="Iconographer+removeIconForEntry"></a>

### iconographer.removeIconForEntry(buttercupEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Remove an icon for a Buttercup entry

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - A promise that resolves with boolean true if the icon was removed  
**See**: removeIconForURL  

| Param | Type | Description |
| --- | --- | --- |
| buttercupEntry | [<code>Entry</code>](#Entry) | The Buttercup entry instance |

<a name="Iconographer+removeIconForURL"></a>

### iconographer.removeIconForURL(pageURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Remove an icon for a URL

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - A promise that resolves with boolean true if the icon was removed  
**Emits**: [<code>iconRemoved</code>](#Iconographer+event_iconRemoved)  

| Param | Type | Description |
| --- | --- | --- |
| pageURL | <code>String</code> | The page URL where the icon was fetched |

<a name="Iconographer+event_iconAdded"></a>

### "iconAdded"
Icon added event
Fired with the associated page URL

**Kind**: event emitted by [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+event_iconFetchFailed"></a>

### "iconFetchFailed"
Icon fetch failure event
Fired with the associated page URL

**Kind**: event emitted by [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+event_iconRemoved"></a>

### "iconRemoved"
Icon removed event
Fired with the associated page URL

**Kind**: event emitted by [<code>Iconographer</code>](#Iconographer)  
<a name="MemoryStorageInterface"></a>

## MemoryStorageInterface ⇐ [<code>StorageInterface</code>](#StorageInterface)
Icon storage interface for in-memory storage of icons

**Kind**: global class  
**Extends**: [<code>StorageInterface</code>](#StorageInterface)  
**See**: StorageInterface  

* [MemoryStorageInterface](#MemoryStorageInterface) ⇐ [<code>StorageInterface</code>](#StorageInterface)
    * [.decodeIconFromStorage(data)](#StorageInterface+decodeIconFromStorage) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.deleteIcon(iconKey)](#StorageInterface+deleteIcon) ⇒ <code>Promise</code>
    * [.encodeIconForStorage(data)](#StorageInterface+encodeIconForStorage) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getIconKeys()](#StorageInterface+getIconKeys) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.retrieveIcon(iconKey)](#StorageInterface+retrieveIcon) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.storeIcon(iconKey, iconData)](#StorageInterface+storeIcon) ⇒ <code>Promise</code>

<a name="StorageInterface+decodeIconFromStorage"></a>

### memoryStorageInterface.decodeIconFromStorage(data) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Decode icon data that was pulled from storage

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A promise that resolves with a buffer  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The encoded data as it was stored |

<a name="StorageInterface+deleteIcon"></a>

### memoryStorageInterface.deleteIcon(iconKey) ⇒ <code>Promise</code>
Delete an icon in storage

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Overrides**: [<code>deleteIcon</code>](#StorageInterface+deleteIcon)  
**Returns**: <code>Promise</code> - A promise that resolves once deletion has completed  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |

<a name="StorageInterface+encodeIconForStorage"></a>

### memoryStorageInterface.encodeIconForStorage(data) ⇒ <code>Promise.&lt;\*&gt;</code>
Encode icon data for storage

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the encoded data ready
 for storage  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | The data buffer for encoding |

<a name="StorageInterface+getIconKeys"></a>

### memoryStorageInterface.getIconKeys() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Fetch all icon keys

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Overrides**: [<code>getIconKeys</code>](#StorageInterface+getIconKeys)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - A promise that resolves with an array of icon keys  
<a name="StorageInterface+retrieveIcon"></a>

### memoryStorageInterface.retrieveIcon(iconKey) ⇒ <code>Promise.&lt;\*&gt;</code>
Retrieve the raw data for an icon

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Overrides**: [<code>retrieveIcon</code>](#StorageInterface+retrieveIcon)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with raw icon data  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |

<a name="StorageInterface+storeIcon"></a>

### memoryStorageInterface.storeIcon(iconKey, iconData) ⇒ <code>Promise</code>
Store encoded icon data

**Kind**: instance method of [<code>MemoryStorageInterface</code>](#MemoryStorageInterface)  
**Overrides**: [<code>storeIcon</code>](#StorageInterface+storeIcon)  
**Returns**: <code>Promise</code> - A promise that resolves once storage has been completed  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |
| iconData | <code>\*</code> | The encoded icon data |

<a name="StorageInterface"></a>

## StorageInterface
Storage interface for storing icons

**Kind**: global class  

* [StorageInterface](#StorageInterface)
    * [.decodeIconFromStorage(data)](#StorageInterface+decodeIconFromStorage) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.deleteIcon(iconKey)](#StorageInterface+deleteIcon) ⇒ <code>Promise</code>
    * [.encodeIconForStorage(data)](#StorageInterface+encodeIconForStorage) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.getIconKeys()](#StorageInterface+getIconKeys) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.retrieveIcon(iconKey)](#StorageInterface+retrieveIcon) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.storeIcon(iconKey, iconData)](#StorageInterface+storeIcon) ⇒ <code>Promise</code>

<a name="StorageInterface+decodeIconFromStorage"></a>

### storageInterface.decodeIconFromStorage(data) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Decode icon data that was pulled from storage

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A promise that resolves with a buffer  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The encoded data as it was stored |

<a name="StorageInterface+deleteIcon"></a>

### storageInterface.deleteIcon(iconKey) ⇒ <code>Promise</code>
Delete an icon in storage

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise</code> - A promise that resolves once deletion has completed  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |

<a name="StorageInterface+encodeIconForStorage"></a>

### storageInterface.encodeIconForStorage(data) ⇒ <code>Promise.&lt;\*&gt;</code>
Encode icon data for storage

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with the encoded data ready
 for storage  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | The data buffer for encoding |

<a name="StorageInterface+getIconKeys"></a>

### storageInterface.getIconKeys() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Fetch all icon keys

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - A promise that resolves with an array of icon keys  
<a name="StorageInterface+retrieveIcon"></a>

### storageInterface.retrieveIcon(iconKey) ⇒ <code>Promise.&lt;\*&gt;</code>
Retrieve the raw data for an icon

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise that resolves with raw icon data  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |

<a name="StorageInterface+storeIcon"></a>

### storageInterface.storeIcon(iconKey, iconData) ⇒ <code>Promise</code>
Store encoded icon data

**Kind**: instance method of [<code>StorageInterface</code>](#StorageInterface)  
**Returns**: <code>Promise</code> - A promise that resolves once storage has been completed  

| Param | Type | Description |
| --- | --- | --- |
| iconKey | <code>String</code> | The icon key |
| iconData | <code>\*</code> | The encoded icon data |

<a name="fetchData"></a>

## fetchData(url) ⇒ <code>Promise.&lt;Buffer&gt;</code>
Fetch data from a URL and return a buffer

**Kind**: global function  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A promise that resolves with the data in a buffer  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The URL to fetch |

<a name="fetchText"></a>

## fetchText(url) ⇒ <code>Promise.&lt;String&gt;</code>
Fetch text from a URL

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with the fetched text  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The URL to fetch |

<a name="setDataFetcher"></a>

## setDataFetcher(fn)
Set the data fetching function

**Kind**: global function  
**See**: fetchData  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> \| <code>undefined</code> | The function to use or undefined to reset |

<a name="setTextFetcher"></a>

## setTextFetcher(fn)
Set the text fetching function

**Kind**: global function  
**See**: fetchText  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> \| <code>undefined</code> | The function to use or undefined to reset |

<a name="getIcon"></a>

## getIcon(url) ⇒ <code>Promise.&lt;(ProcessedIcon\|null)&gt;</code>
Get an icon from a page
Resolves the URL before processing

**Kind**: global function  
**Returns**: <code>Promise.&lt;(ProcessedIcon\|null)&gt;</code> - A promise that resolves with icon information, or null  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The page URL |

<a name="getIconForURL"></a>

## getIconForURL(url) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
Get the icon data from a page URL

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Buffer\|null)&gt;</code> - A promise that resolves with a buffer containing the icon or
 null if no icon was found  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | The target page URL |

<a name="ProcessedIcon"></a>

## ProcessedIcon : <code>Object</code>
Processed icon information

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | The icon's data |
| url | <code>String</code> | URL of the icon |
| size | <code>Number</code> | Size of the icon (width == height) |

<a name="Entry"></a>

## Entry : <code>Object</code>
Buttercup Entry

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| getMeta | <code>function</code> | Fetch meta from the entry |

