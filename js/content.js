/*
 * Content.js
 * Copyright (c) 2011 Srichand Pendyala <srichand.pendyala@gmail.com>
 * Licensed for used under terms of the MIT X11 license. See 
 * the LICENSE file for complete details.
 */

var username = "srichand";
var api_key = "R_d063f28e393d2db343ede07d0ecba220";

function SetSel (short_url, long_url) {
    var sel = "a[href*=" + short_url + "]";
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
        console.log("Making request for URLs: " + short_urls);
        $.ajax ({
            type: "GET",
            url: "http://api.bit.ly/v3/expand",
            data: short_urls + "&apiKey=" + api_key + "&login=" 
            + username,
            dataType: "json",
            jsonp: "jsoncallback",
            success: function (v) {
                $.each(v.data.expand, function (index, element) {
                    short_url = element.short_url;
                    long_url = element.long_url;                 
                    if (long_url != undefined) {
                        map[short_url] = long_url;
                        SetSel(short_url, long_url); 
                    }
                });
                var request_obj = Object();
                request_obj.map = map;
                request_obj.method = "StoreLocal";
                chrome.extension.sendRequest(request_obj,
                    function (response) {
                       console.log("Received response to StoreLocal");
                    }
                );
            }
        });        
    } // End while
}
 
 
/*
 * This caches all bit.ly links into a single array and then 
 * makes a single AJAX call to fetch the expanded URLs.
 */
$().ready(
    function() {
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
                console.log("Not in cache: " + response.not_in_cache);
                /* First we deal with stuff not in our cache */
                var not_in_cache = response.not_in_cache;                
                CallBitly (not_in_cache);
            
                console.log("Stuff In cache: " + 
                    JSON.stringify(response.in_cache));
                    
                /* Next, deal with stuff already in the cache */
                var in_cache = response.in_cache;
                $.each(response.in_cache, function (short_url, long_url) {
                    console.log("In cache: " + short_url + " and " + long_url);
                    SetSel(short_url, long_url);
                });
            
        });
    }   
);
