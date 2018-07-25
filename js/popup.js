let list = document.getElementById("list");

// populate the popup
let historyItemList = new HistoryItemList();
let treeItemList = new TreeItemList();
let historyItems = FlattenObjectToValueArray(historyItemList.items);

let historyHour = {};
let historyToday = {};
let historyLastWeek = {};
let historyLastMonth = {};
let historyOlder = {};

let currentDate = new Date();
let currentTimeInMillis = currentDate.getTime();

function PutHistoryItemInGroup(group, historyItem)
{
    let treeItem = treeItemList.GetItemWithId(historyItem.treeId);
    let hostname = ExtractHostname(historyItem.url);
    if (treeItem.isSearchEngine)
    {
        hostname = treeItem.searchEngine + " Search: " + treeItem.searchString;
    }
    if (!(hostname in group))
    {
        group[hostname] = [];
    }
    group[hostname].push(historyItem);
}


for (let i = historyItems.length - 1; i >= 0; i--)
{
    let historyItem = historyItems[i];
    let hoursOld = Math.ceil((currentTimeInMillis - historyItem.timeStamp) / 3600000);
    let daysOld = Math.ceil(hoursOld / 24);
    if (hoursOld <= 1)
        PutHistoryItemInGroup(historyHour, historyItem);
    else if (daysOld <= 1)
        PutHistoryItemInGroup(historyToday, historyItem);
    else if (daysOld <= 7)
        PutHistoryItemInGroup(historyLastWeek, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyLastMonth, historyItem);
    else if (daysOld <= 30)
        PutHistoryItemInGroup(historyOlder, historyItem);
}

function FillUpHistory(historyObject, parentDomId)
{
    let i = 1;
    for (var hostName in historyObject) 
    {
        if (historyObject.hasOwnProperty(hostName))
        {
            let id = parentDomId.id + i;
            i++;
            parentDomId.innerHTML += `
            <a class="btn btn-outline-primary rounded-0 text-left btn-block result-title" data-toggle="collapse" href="#${id}" role="button" aria-expanded="false" aria-controls="collapseExample" style="margin-top:2px;">
                ${hostName}
            </a>
            <div class="collapse" id="${id}">
                <div class="card card-body history-item-element rounded-0" id="${id}-card">
                </div>
            </div>
            `;
            let historyArray = historyObject[hostName];
            for (let i = historyArray.length - 1; i >= 0; --i)
            {
                let url = historyArray[i].url;
                if (url)
                {
                    let domain = historyArray[i].hostname;
                    let favicon = "../image/browseraction_icon_40.png";
                    if (historyArray[i].faviconUrl != undefined)
                    {
                        favicon = historyArray[i].faviconUrl;
                    }
                    let dateString = GetDateStringFromTimeStamp(historyArray[i].timeStamp);
                    document.getElementById(id + "-card").innerHTML = `
                    <div class="row">
                        <div class="col-1">
                        <img src="${favicon}" class="favicon">
                        </div>
                        <div class="col-8">
                        <div class="title-text">${historyArray[i].title}</div>
                        <div><a href="${url}" data-toggle="tooltip" title="${url}" class="url-text">${url}</a></div>
                        </div>
                        <div class="col-2 time-text-parent">
                        <span class="time-text">${dateString}</span>
                        </div>
                    </div>
                    ` + document.getElementById(id + "-card").innerHTML;
                    if (i > 0)
                    {
                        document.getElementById(id + "-card").innerHTML = '<hr>' + document.getElementById(id + "-card").innerHTML;
                    }
                }
            }
        }
    }

    if (i == 1) // No items available
    {
        let id = parentDomId.id;
        id = id.substr(0, id.lastIndexOf("Items")) + "Block";
        $("#" + id).css("display", "none");
    }
}

FillUpHistory(historyHour, thisHourHistoryItems);
FillUpHistory(historyToday, todayHistoryItems);
FillUpHistory(historyLastWeek, thisWeekHistoryItems);
FillUpHistory(historyLastMonth, lastMonthHistoryItems);
FillUpHistory(historyOlder, olderHistoryItems);

$("#loader").css("display", "none");
$("#HistoryContent").css("display", "block");
$("#allItem").css("display", "block");
$(document).ready(function ()
{
    $('[data-toggle="tooltip"]').tooltip();
});

// construct the suggestion engine
var pages = new Bloodhound({
    datumTokenizer: function (d)
    {
        var titleTokens = Bloodhound.tokenizers.whitespace(d.title);
        var urlTokens = Bloodhound.tokenizers.nonword(d.url);

        return titleTokens.concat(urlTokens);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: historyItems
});

var initialized = pages.initialize();
initialized
    .done(function () { console.log('ready to go!'); })
    .fail(function () { console.log('err, something went wrong :('); });

$('#searchWorker').typeahead({
    hint: false,
    highlight: true,
    minLength: 1
},
    {
        name: 'pages',
        source: pages
    });

$("#searchbox").on('input change click', function ()
{
    $(".typeahead").typeahead('val', $(this).val());
    UpdateSearchBox();
});

$(".close-icon").on('click', function ()
{
    $("#searchbox").val("");
    $(".typeahead").typeahead('val', $("#searchbox").val());
    UpdateSearchBox();
});

function UpdateSearchBox()
{
    let text = $("#searchbox").val();
    $("#searchResults").html("");
    if (text.length == 0)
    {
        $("#HistoryContent").css("display", "block");
        $("#search").css("display", "none");
        return;
    }
    $("#HistoryContent").css("display", "none");
    $("#search").css("display", "block");

    let resultBlocks = $('.tt-suggestion');

    for (let i = 0; i < resultBlocks.length; ++i)
    {
        let result = JSON.parse($(resultBlocks[i]).text());
        let searchResultHtml = `
                    <div class="row">
                        <div class="col-1">
                        <img src="${result.faviconUrl}" class="favicon">
                        </div>
                        <div class="col-8">
                        <div class="title-text">${result.title}</div>
                        <div><a href="${result.url}" data-toggle="tooltip" title="${result.url}" class="url-text">${result.url}</a></div>
                        </div>
                        <div class="col-2 time-text-parent">
                        <span class="time-text">${GetDateStringFromTimeStamp(result.timeStamp)}</span>
                        </div>
                    </div>
                    `;
        $("#searchResults").html($("#searchResults").html() + searchResultHtml + "<hr>");
    }
    if (resultBlocks.length == 0)
    {
        $("#searchResults").html(`<div class="alert alert-dark">No Search Result!</div>`);
    }
}