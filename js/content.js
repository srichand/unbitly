/*
 * Content.js
 * Copyright (c) 2011 Srichand Pendyala <srichand.pendyala@gmail.com>
 */

var username = "srichand";
var api_key = "R_d063f28e393d2db343ede07d0ecba220";

/*
 * This makes a call for each bitly link on the page
 * which is pretty unoptimal.
 

$().ready(
    function() {
        $('a[href*=bit.ly]').each(function() {
            var element = this;
            var link = $(this).attr("href");
            console.log ("Link is" + link);
            $.ajax({
                type: "GET",
                url: "http://api.bit.ly/v3/expand",
                data: {shortUrl: link, apiKey: api_key, login:username},
                dataType: "json",
                success: function (v) {
                    var new_link = v.data.expand[0].long_url;
                    $(element).attr("title", new_link);
                }
            }); 
        });
    }
);
*/


/*
 * This caches all bit.ly links into a single array and then 
 * makes a single AJAX call to fetch the expanded URLs.
 */
$().ready(
    function() {
        var map = {};
        var list = [];
        $('a[href*=bit.ly]').each( function() {
           list.push($(this).attr("href")); 
        });
        console.log("list is: " + list);
        var short_urls = "";
        
        $.each(list, function(index, v) {
            console.log("List element: " + v);
            short_urls += "&shortUrl=" + v; 
        });
        console.log("Looking at urls: " + short_urls);
        $.ajax ({
            type: "GET",
            url: "http://api.bit.ly/v3/expand",
            data: short_urls + "&apiKey=" + api_key + "&login=" + username,
            dataType: "json",
            jsonp: "jsoncallback",
            success: function (v) {
                console.log("Received: " + v.data.expand[0].long_url);
                $.each(v.data.expand, function (index, element) {
                    short_url = element.short_url;
                    long_url = element.long_url;
                    console.log("Short: " + short_url + " long: "
                        + long_url);
                    map[short_url] = long_url;
                });
                $.each(map, function(key, value){
                    console.log("Expanding: " + key + " to value: " + value);
                    var sel = "a[href*=" + key + "]";
                    console.log("Selector: " + sel);
                    $(sel).attr("title", value);
                });
            }
        });
    }   
);


















