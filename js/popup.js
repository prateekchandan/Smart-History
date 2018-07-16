let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();
for (let i = historyItems.length - 1; i >= 0; --i)
{
    let itemHtml = "<tr>";
    itemHtml += "<td class=\"td1\">" + historyItems[i].id + "</td>";
    itemHtml += "<td class=\"td2\">" + historyItems[i].parentId + "</td>"
    itemHtml += "<td class=\"td3\">" + " <a href=" + historyItems[i].url + ">" + historyItems[i].url + "</a></td>"
    mainTable.innerHTML += itemHtml;
}

