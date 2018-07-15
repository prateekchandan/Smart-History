// Background things will be written in this file

browserWrapper.tabs.onUpdated.addListener(OnTabUpdated);
browserWrapper.tabs.onActivated.addListener(OnTabAcitvated);

var currentTabId = -1;
var tabToHistoryMap = {};

function OnTabUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
      var parentId = tabToHistoryMap[currentTabId];
      if(parentId == null)
      {
        parentId = -1;
      }
      var historyItem = new HistoryItem(changeInfo.url, parentId, Date.now());
      AddToHistoryList(historyItem);
      tabToHistoryMap[tabId] = historyItem.id;
    }
}

function OnTabAcitvated(activeInfo) {
  currentTabId =  activeInfo.tabId;
}