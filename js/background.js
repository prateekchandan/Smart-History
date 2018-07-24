// Background things will be written in this file

browserWrapper.tabs.onUpdated.addListener(OnTabUpdated);
browserWrapper.tabs.onActivated.addListener(OnTabAcitvated);

let currentTabId = -1;
let tabToHistoryMap = {};

function OnTabUpdated(tabId, changeInfo, tabInfo)
{
    if (changeInfo.status == "complete")
    {
        if((tabInfo.title == "New tab") || (tabInfo.title == "Can’t reach this page"))
        {
            return;
        }
        let parentId = tabToHistoryMap[currentTabId];
        if (parentId == null)
        {
            parentId = -1;
        }
        console.log(tabInfo);
        let historyItem = new HistoryItem(tabInfo.title, tabInfo.url, parentId, tabInfo.favIconUrl, Date.now());
        ExtensionState.AddToHistoryList(historyItem);
        tabToHistoryMap[tabId] = historyItem.id;
    }
}

function OnTabAcitvated(activeInfo)
{
    currentTabId = activeInfo.tabId;
}
