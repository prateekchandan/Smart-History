// Background things will be written in this file

browserWrapper.tabs.onUpdated.addListener(OnTabUpdated);
browserWrapper.tabs.onActivated.addListener(OnTabAcitvated);

let currentTabId = -1;
let tabToHistoryMap = {};

function OnTabUpdated(tabId, changeInfo, tabInfo)
{
    if (changeInfo.url)
    {
        let parentId = tabToHistoryMap[currentTabId];
        if (parentId == null)
        {
            parentId = -1;
        }
        let historyItem = new HistoryItem(changeInfo.url, parentId, Date.now());
        ExtensionState.AddToHistoryList(historyItem);
        tabToHistoryMap[tabId] = historyItem.id;
    }
}

function OnTabAcitvated(activeInfo)
{
    currentTabId = activeInfo.tabId;
}
