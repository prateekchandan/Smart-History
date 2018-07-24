// This is the helper class containing all the structures needed

// This is the browserWrapper, switch values between
// chrome and browser to switch between different browser extensions

// For all browsers except chrome
let browserWrapper = browser;

// For chrome
// var browserWrapper = chrome;

let c_historySotageId = "HistoryItems";
let c_treeStorageId = "TreeItems";
let c_id = "Id";
let c_treeId = "TreeId";

class ExtensionState
{
    static CreateNewIdHelper(idString)
    {
        let lastId = localStorage.getItem(idString);
        if (lastId == null)
        {
            lastId = -1;
        }
        lastId++;
        localStorage.setItem(idString, lastId);
        return lastId;
    }

    static CreateNewId()
    {
        return ExtensionState.CreateNewIdHelper(c_id);
    }

    static CreateNewTreeId()
    {
        return ExtensionState.CreateNewIdHelper(c_treeId);
    }
}

class HistoryItem
{
    constructor(title, url, parentId, faviconUrl, treeId)
    {
        this.title = title;
        this.id = ExtensionState.CreateNewId();
        this.parentId = parentId;
        this.url = url;
        this.timeStamp = Date.now();
        this.hostname = ExtractHostname(url);
        this.faviconUrl = faviconUrl;
        this.treeId = treeId;
    }
}

class TreeItem
{
    constructor(hostname, searchString)
    {
        this.id = ExtensionState.CreateNewTreeId();
        this.hostname = hostname;
        this.timeStamp = Date.now();
        this.UpdateWithSearchString(searchString);
    }

    UpdateWithSearchString(searchString)
    {
        this.searchString = searchString;
        this.isSearchEngine = !((searchString == null) || (searchString.length == 0));
        if(this.isSearchEngine)
        {
            if(this.hostname == "www.google.com")
            {
                this.searchEngine == "Google";
            }
            else if(this.hostname == "www.bing.com")
            {
                this.searchEngine == "Bing";
            }
        }
    }
}

class HistoryItemList
{
    constructor()
    {
        let historyItems = localStorage.getItem(c_historySotageId);
        if (historyItems == null)
        {
            historyItems = "{}";
        }
        this.items = JSON.parse(historyItems);
    }

    AddOrupdateItems(historyItem)
    {
        this.items[historyItem.id] = historyItem;
        this.Update();
    }

    GetItemWithId(id)
    {
        return this.items[id];
    }

    Update()
    {
        localStorage.setItem(c_historySotageId, JSON.stringify(this.items));
    }
}

class TreeItemList
{
    constructor()
    {
        let treeItems = localStorage.getItem(c_treeStorageId);
        if (treeItems == null)
        {
            treeItems = "{}";
        }
        this.items = JSON.parse(treeItems);
    }

    AddOrupdateItems(treeItem)
    {
        this.items[treeItem.id] = treeItem;
        this.Update();
    }

    GetItemWithId(id)
    {
        return this.items[id];
    }

    Update()
    {
        localStorage.setItem(c_treeStorageId, JSON.stringify(this.items));
    }
}

//#region Util Methods

function ExtractHostname(url) 
{
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    //find & remove "#"
    hostname = hostname.split('#')[0];

    return hostname;
}

function FlattenObjectToValueArray(obj)
{
    let arr = [];
    for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
            arr.push(obj[id]);
        }
    }
    return arr;
}

//#endregion