// Background things will be written in this file

browserWrapper.tabs.onUpdated.addListener(handleUpdated);

function handleUpdated(tabId, changeInfo, tabInfo)
{
  if (changeInfo.url)
  {
    let historyItem = new HistoryItem(changeInfo.url, Date.now());
    ExtensionState.AddToHistoryList(historyItem);
  }
}

