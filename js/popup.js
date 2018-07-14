var list = document.getElementById("list");

// populate the popup
var historyItems = GetAllHistoryItem();
for(i = historyItems.length - 1 ; i >= 0 ; --i)
{
    list.innerHTML += "<li><a href="+historyItems[i].url+">"+historyItems[i].url+"</a></li>";
}

