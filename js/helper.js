// This is the helper class containing all the structures needed

// This is the browserWrapper, switch values between
// chrome and browser to switch between different browser extensions

// For all browsers except chrome
var browserWrapper = browser;

// For chrome
// var browserWrapper = chrome;

let c_historySotageId = "HistoryItems";
let c_id = "Id";

class ExtensionState
{
    static CreateNewId()
    {
        let lastId = localStorage.getItem(c_id);
        if (lastId == null)
        {
            lastId = -1;
        }
        lastId++;
        localStorage.setItem(c_id, lastId);
        return lastId;
    }

    static GetAllHistoryItems()
    {
        let historyItems = localStorage.getItem(c_historySotageId);
        if (historyItems == null)
        {
            return [];
        };
        historyItems = "[" + historyItems + "]";
        historyItems = JSON.parse(historyItems);
        return historyItems;
    }

    static AddToHistoryList(historyItem)
    {
        let historyItems = ExtensionState.GetAllHistoryItems();
        historyItems.push(historyItem);

        for (let i = 0; i < historyItems.length; ++i)
        {
            historyItems[i] = JSON.stringify(historyItems[i]);
        }

        localStorage.setItem(c_historySotageId, historyItems);
    }

    static PrintAllItems()
    {
        let historyItems = ExtensionState.GetAllHistoryItems();
        for (let i = historyItems.length - 1; i >= 0; --i)
        {
            console.log(historyItems[i]);
        }
    }
}

class HistoryItem
{
    constructor(url, parentId, timeStamp)
    {
        this.id = ExtensionState.CreateNewId();
        this.parentId = parentId;
        this.url = url;
        this.timeStamp = timeStamp;
    }
}