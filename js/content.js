/*
 * Content.js
 * Copyright (c) 2011 Srichand Pendyala <srichand.pendyala@gmail.com>
 * Licensed for used under terms of the MIT X11 license. See 
 * the LICENSE file for complete details.
 */

var username = "";
var api_key = "";

function SetSel (short_url, long_url) {
    var sel = "a[href*=" + short_url + "]";
    console.log("Setting " + sel + " to " + long_url);
    $(sel).attr("title", long_url);
}

function CallBitly (big_list) {
    /*
     * bit.ly's API allows a maximum of 15 URLs 
     * to call expand. So we splice the big list
     * into smaller lists 15 URLs at a time.
     */
    while (big_list.length > 0) {
        var list = big_list.splice(0, 15);
        var map = {};
        var short_urls = "";
        $.each(list, function(index, v) {
            short_urls += "&shortUrl=" + v;
        });
        //console.log("Making request for URLs: " + short_urls);
        var request_obj = Object();
        request_obj.method = "ExpandLinks";
        request_obj.short_urls = short_urls;
        chrome.extension.sendRequest(request_obj,
            function (response) {
                $.each(response.map, function (short_url, long_url) {
                    //console.log("Received final response: " + short_url
                    //    + " for " + long_url);
                    SetSel(short_url, long_url);        
                });
            }
        );
     
    } // End while
}
 
/* 
 * Call after authentication!
 */
function Unbitly() {
     var big_map = {};
     var big_list = [];
     $('a[href*=bit.ly]').each( function() {
         big_list.push($(this).attr("href")); 
     });
     
     var request_obj = Object();
     request_obj.big_list = big_list;
     request_obj.method = "GetLocal";
     
     console.log("Calling background with: "  + request_obj.big_list);
     
     // Async message passing
     chrome.extension.sendRequest(request_obj, 
         function(response) {
             //console.log("Not in cache: " + response.not_in_cache);
             /* First we deal with stuff not in our cache */
             var not_in_cache = response.not_in_cache;                
             CallBitly (not_in_cache);
         
             //console.log("Stuff In cache: " + 
             //    JSON.stringify(response.in_cache));
                 
             /* Next, deal with stuff already in the cache */
             var in_cache = response.in_cache;
             $.each(response.in_cache, function (short_url, long_url) {
                 //console.log("In cache: " + short_url + " and " + long_url);
                 SetSel(short_url, long_url);
             });
         
     });
}   

 
/*
 * This caches all bit.ly links into a single array and then 
 * makes a single AJAX call to fetch the expanded URLs.
 */
$().ready(function () {
    var request = Object();
    request.method = "GetAuth";
    chrome.extension.sendRequest(request, 
        function (response) {
            username = response.username;
            api_key = response.api_key;
            Unbitly();
        }
    );
});














