var list = document.getElementById("list");

// populate the popup
var historyItems = GetAllHistoryItem();
for(i = historyItems.length - 1 ; i >= 0 ; --i)
{
    var itemHtml = "<li> id: " + historyItems[i].id + " parentId = " + historyItems[i].parentId;
    itemHtml += " <a href=" +historyItems[i].url+">" + historyItems[i].url+ "</a></li>";
    list.innerHTML += itemHtml;
}

