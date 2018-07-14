// This is the helper class containing all the structures needed

// This is the browserWrapper, switch values between
// chrome and browser to switch between different browser extensions

// For all browsers except chrome
var browserWrapper = browser;

// For chrome
// var browserWrapper = chrome;

var c_historySotageId = "HistoryItems";
var c_id = "Id";

function CreateNewId()
{
    var lastId = localStorage.getItem(c_id);
    if(lastId == null)
    {
        lastId = -1;
    }
    lastId++;
    localStorage.setItem(c_id, lastId);
    return lastId;
}

function HistoryItem(url, timeStamp)
{
    // TODO : Set the parent Id here

    this.id = CreateNewId();
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

function PrintAllItems()
{
    var historyItems = GetAllHistoryItem();
    for(i = historyItems.length - 1 ; i >= 0 ; --i)
    {
        console.log(historyItems[i]);
    }
}