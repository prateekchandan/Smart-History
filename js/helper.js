// This is the helper class containing all the structures needed

// This is the browserWrapper, switch values between
// chrome and browser to switch between different browser extensions

// For all browsers except chrome
var browserWrapper = browser;

// For chrome
// var browserWrapper = chrome;

var c_historySotageId = "HistoryItems";

function HistoryItem(url, timeStamp)
{
    // TODO : Set the Id here
    // TODO : Set the parent Id here

    this.url = url;
    this.timeStamp = timeStamp
}

function AddToHistoryList(historyItem)
{
    var historyItems = GetAllHistoryItem();
    historyItems.push(historyItem);

    for(i = 0; i < historyItems.length; ++i)
    {
       historyItems[i] = JSON.stringify(historyItems[i]);
    }

    localStorage.setItem(c_historySotageId, historyItems);
}

function GetAllHistoryItem()
{
    var historyItems = localStorage.getItem(c_historySotageId);
    if(historyItems == null)
    {
        return [];
    };
    historyItems = "[" + historyItems + "]";
    historyItems = JSON.parse(historyItems);
    return historyItems;
}