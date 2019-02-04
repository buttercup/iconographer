<a name="module_Iconographer"></a>

## Iconographer

* [Iconographer](#module_Iconographer)
    * _static_
        * [.getIconDataURI(domain, [opts])](#module_Iconographer.getIconDataURI) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.getIconDetails(domain, [param1])](#module_Iconographer.getIconDetails) ⇒ <code>IconDetails</code>
        * [.getIconFilename(domain, [opts])](#module_Iconographer.getIconFilename) ⇒ <code>String</code>
        * [.getResourcesPath()](#module_Iconographer.getResourcesPath) ⇒ <code>String</code>
        * [.iconExists(domain)](#module_Iconographer.iconExists) ⇒ <code>Boolean</code>
    * _inner_
        * [~IconOptions](#module_Iconographer..IconOptions) : <code>Object</code>
        * [~IconDetails](#module_Iconographer..IconDetails) : <code>Object</code>

<a name="module_Iconographer.getIconDataURI"></a>

### Iconographer.getIconDataURI(domain, [opts]) ⇒ <code>Promise.&lt;String&gt;</code>
Get the Data URI for an icon

**Kind**: static method of [<code>Iconographer</code>](#module_Iconographer)  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with the data URI  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>String</code> | The domain to get an icon for |
| [opts] | <code>IconOptions</code> | Options |

<a name="module_Iconographer.getIconDetails"></a>

### Iconographer.getIconDetails(domain, [param1]) ⇒ <code>IconDetails</code>
Get icon details for a domain

**Kind**: static method of [<code>Iconographer</code>](#module_Iconographer)  
**Returns**: <code>IconDetails</code> - Icon details  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>String</code> \| <code>null</code> | The domain to get icon details for. Pass null or undefined  to automatically fetch the default icon |
| [param1] | <code>IconOptions</code> | Options for getting the icon |

<a name="module_Iconographer.getIconFilename"></a>

### Iconographer.getIconFilename(domain, [opts]) ⇒ <code>String</code>
Get the filename of an icon for a domain

**Kind**: static method of [<code>Iconographer</code>](#module_Iconographer)  
**Returns**: <code>String</code> - The icon filename  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>String</code> | The domain |
| [opts] | <code>IconOptions</code> | Options for getting the icon |

<a name="module_Iconographer.getResourcesPath"></a>

### Iconographer.getResourcesPath() ⇒ <code>String</code>
Return the path to the resources directory

**Kind**: static method of [<code>Iconographer</code>](#module_Iconographer)  
**Returns**: <code>String</code> - The path  
<a name="module_Iconographer.iconExists"></a>

### Iconographer.iconExists(domain) ⇒ <code>Boolean</code>
Check if a unique icon exists for a domain

**Kind**: static method of [<code>Iconographer</code>](#module_Iconographer)  
**Returns**: <code>Boolean</code> - True if a unique icon exists, false if only the default icon  

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>String</code> | The domain to check for |

<a name="module_Iconographer..IconOptions"></a>

### Iconographer~IconOptions : <code>Object</code>
**Kind**: inner typedef of [<code>Iconographer</code>](#module_Iconographer)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [greyscale] | <code>Boolean</code> | Whether or not to request greyscale icons (default false) |

<a name="module_Iconographer..IconDetails"></a>

### Iconographer~IconDetails : <code>Object</code>
**Kind**: inner typedef of [<code>Iconographer</code>](#module_Iconographer)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| filename | <code>String</code> | The full path of the icon file |
| isDefault | <code>Boolean</code> | Whether the icon is the default icon or not |

