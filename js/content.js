/*
 * Content.js
 * Copyright (c) 2011 Srichand Pendyala <srichand.pendyala@gmail.com>
 */

var username = "srichand";
var api_key = "R_d063f28e393d2db343ede07d0ecba220";

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
