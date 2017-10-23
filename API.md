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
    * [.queue](#Iconographer+queue) : <code>ChannelQueue</code>
    * [.storageInterface](#Iconographer+storageInterface) : <code>StorageInterface</code>
    * [.emitAsync(key, ...args)](#Iconographer+emitAsync)
    * [.getIconForEntry(buttercupEntry)](#Iconographer+getIconForEntry) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
    * [.getIconForURL(pageURL)](#Iconographer+getIconForURL) ⇒ <code>Promise.&lt;(Buffer\|null)&gt;</code>
    * [.processIconForEntry(buttercupEntry)](#Iconographer+processIconForEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.processIconForURL(pageURL)](#Iconographer+processIconForURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.removeIconForEntry(buttercupEntry)](#Iconographer+removeIconForEntry) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.removeIconForURL(pageURL)](#Iconographer+removeIconForURL) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * ["iconAdded"](#Iconographer+event_iconAdded)
    * ["iconFetchFailed"](#Iconographer+event_iconFetchFailed)
    * ["iconRemoved"](#Iconographer+event_iconRemoved)

<a name="Iconographer+queue"></a>

### iconographer.queue : <code>ChannelQueue</code>
Get the channel queue instance

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+storageInterface"></a>

### iconographer.storageInterface : <code>StorageInterface</code>
Get the storage interface instance

**Kind**: instance property of [<code>Iconographer</code>](#Iconographer)  
<a name="Iconographer+emitAsync"></a>

### iconographer.emitAsync(key, ...args)
Emit an event asynchronously

**Kind**: instance method of [<code>Iconographer</code>](#Iconographer)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The event key |
| ...args | <code>\*</code> | The event arguments |

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
| buttercupEntry | <code>Entry</code> | The Buttercup entry instance |

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
| buttercupEntry | <code>Entry</code> | The Buttercup entry instance |

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
| buttercupEntry | <code>Entry</code> | The Buttercup entry instance |

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
