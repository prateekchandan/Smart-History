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
        let treeId = -1;
        let treeItem = null;
        if (parentId == null)
        {
            parentId = -1;
            treeItem = new TreeItem(ExtractHostname(tabInfo.url), null);
            treeItemList.AddOrupdateItems(treeItem);
            treeId = treeItem.id;
        }
        else
        {
            treeId = historyItemList.GetItemWithId(parentId).treeId;
            treeItem = treeItemList.GetItemWithId(treeId);
            treeItem.timeStamp = Date.now();
            treeItemList.AddOrupdateItems(treeItem);
        }
        let historyItem = new HistoryItem(tabInfo.title, tabInfo.url, parentId, tabInfo.favIconUrl, treeId);
        console.log(historyItem);
        historyItemList.AddOrupdateItems(historyItem);
        tabToHistoryMap[tabId] = historyItem.id;

        if((historyItem.hostname == "www.google.com") || (historyItem.hostname == "www.bing.com"))
        {
            InjectContentScript(tabId);
        }
    }
}

function OnTabAcitvated(activeInfo)
{
    currentTabId = activeInfo.tabId;
}

function InjectContentScript(tabId)
{
    console.log(tabId);
    browserWrapper.tabs.executeScript(tabId, {
        code: `console.log('location:', window.location.href);`
    }, function(results) {
        if (browserWrapper.runtime.lastError || !results || !results.length) {
            console.log("Inserting contentScriptError");
            console.log(browserWrapper.runtime.lastError);
            console.log(results);
            return;  // Permission error, tab closed, etc.
        }
        console.log("Inserting contentScript Success");
    });
}