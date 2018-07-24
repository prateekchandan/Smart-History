// Background things will be written in this file

browserWrapper.tabs.onUpdated.addListener(OnTabUpdated);
browserWrapper.tabs.onActivated.addListener(OnTabAcitvated);

let currentTabId = -1;
let tabToHistoryMap = {};

let historyItemList = new HistoryItemList();
let treeItemList = new TreeItemList();

function OnTabUpdated(tabId, changeInfo, tabInfo)
{
    if (changeInfo.status == "complete")
    {
        if((tabInfo.title == "New tab") || (tabInfo.title == "Can’t reach this page"))
        {
            return;
        }
        let parentId = tabToHistoryMap[currentTabId];
        let hostname = ExtractHostname(tabInfo.url);
        let searchString = GetSearchStringFromUrl(tabInfo.url, hostname);
        let treeItem = null;
        if (parentId == null)
        {
            parentId = -1;
            treeItem = new TreeItem(ExtractHostname(tabInfo.url), searchString);
            treeItemList.AddOrupdateItems(treeItem);
        }
        else
        {
            treeItem = treeItemList.GetItemWithId(historyItemList.GetItemWithId(parentId).treeId);
            treeItem.timeStamp = Date.now();
            if(searchString != null)
            {
                if(treeItem.isSearchEngine)
                {
                    treeItem = new TreeItem(ExtractHostname(tabInfo.url), searchString);
                }
                else
                {
                    treeItem.UpdateWithSearchString(searchString);

                }
            }
            treeItemList.AddOrupdateItems(treeItem);
        }
        let historyItem = new HistoryItem(tabInfo.title, tabInfo.url, parentId, tabInfo.favIconUrl, treeItem.id);
        console.log(historyItem);
        historyItemList.AddOrupdateItems(historyItem);
        tabToHistoryMap[tabId] = historyItem.id;
    }
}

function OnTabAcitvated(activeInfo)
{
    currentTabId = activeInfo.tabId;
}

function GetSearchStringFromUrl(url, hostname)
{
    if((hostname == "www.google.com") || (hostname == "www.bing.com"))
    {
        let queryString = GetParameterByName('q', url);
        return queryString;
    }
    return null;
}

function GetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}