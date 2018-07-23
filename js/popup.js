let list = document.getElementById("list");

// populate the popup
let historyItems = ExtensionState.GetAllHistoryItems();

let historyToday = [];
let historyLastWeek = [];
let historyLastMonth = [];

let currentDate = new Date();
let currentTimeInMillis = currentDate.getTime();

historyItems.map((historyItem) =>
{
    let daysOld = Math.ceil((currentTimeInMillis - historyItem.timeStamp) / 86400000);

    if (daysOld <= 1)
        historyToday.push(historyItem);
    else if (daysOld <= 7)
        historyLastWeek.push(historyItem);
    else if (daysOld <= 30)
        historyLastMonth.push(historyItem);
});

function FillUpHistory(historyArray, parentDomId)
{
    for (let i = historyArray.length - 1; i >= 0; --i)
    {
        let url = historyArray[i].url;
        if (url)
        {
            let domain = historyArray[i].hostname;
            parentDomId.innerHTML += `
                <div class="col-1">${historyArray[i].id}</div>
                <div class="col-1">${historyArray[i].parentId}</div>
                <div class="col-10"><p style="overflow:hidden;"><a href="${historyArray[i].url}">
                    ${domain == undefined ? "Unknown" : domain}
                </a></p></div>
            `
        }
    }
}

FillUpHistory(historyToday, todayHistory);
FillUpHistory(historyLastWeek, thisWeekHistory);
FillUpHistory(historyLastMonth, lastMonthHistory);

$("#loader").css("display","none");
$("#content").css("display","block");