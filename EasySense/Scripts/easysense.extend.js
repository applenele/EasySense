﻿var page = 0;
var lock = false;
var order = "asc";
var orderby = null;

$("[data-col]").click(function () {
    page = 0;
    $("img[src='/Images/asc.png']").remove();
    $("img[src='/Images/desc.png']").remove();
    if (order == "asc") order = "desc";
    else order = "asc";
    if (orderby == null || orderby != $(this).attr("data-col"))
        orderby = $(this).attr("data-col");
    $(this).append('<img src="/Images/' + order + '.png" />');

    if ($("#lstProjects").length > 0)
        $("#lstProjects").html("");
    Load();
});

function Load()
{
    if (lock) return;
    lock = true;    
    LoadProjects();
}

function LoadProjects()
{
    if ($("#lstProjects").length <= 0) return;
    ShowLoading();
    $.getJSON("/Project/Search", {
        Page: page,
        Order: order,
        OrderBy: orderby,
        Title: $("#txtTitle").val(),
        Status: $("#lstStatus").val(),
        Begin: $("#txtBegin").val(),
        End: $("#txtEnd").val(),
        InvoiceBegin: $("#txtInvoiceBegin").val(),
        InvoiceEnd: $("#txtInvoiceEnd").val(),
        EnterpriseID: $("#lstEnterpriseID").val()
    }, function (data) {
        for (var i = 0; i < data.length; i++)
        {
            $("#lstProjects").append('<tr onclick="window.location=\'\/Project\/Show\/' + data[i].ID + '\'"><td>' + data[i].ID + '</td><td>' + data[i].Owner + '</td><td>' + data[i].Title + '</td><td>￥' + data[i].Charge + '</td><td>' + data[i].SignTime + '</td><td>' + data[i].Product + '</td><td>' + data[i].Enterprise + '</td><td>' + data[i].Brand + '</td><td>' + data[i].Customer + '</td><td>' + data[i].Status + '</td><td>' + data[i].InvoiceTime + '</td><td>' + data[i].ChargeTime + '</td></tr>');
        }
        page++;
        lock = false;
        HideLoading();
    });
}

function Search() {
    $("#SearchResult").html("<img src='/Images/loading-small.gif' />加载中...");
    $.getJSON("/Search", { Text: $("#txtSearchAll").val() }, function (data) {
        var str = "";
        if ($("#SearchResult").length > 0) {
            str += "<p class='es-notification-subtitle'>项目(" + data.Projects.length + ")</p>";
            if (data.Projects.length > 0) {
                $.each(data.Projects, function (key, value) {
                    str += "<p><a href='/Project/Show/" + value.ID + "'>" + value.Title + "</a></p>";
                });
            }
            str += "<p class='es-notification-subtitle'>客户(" + data.Enterprises.length + ")</p>";
            if (data.Enterprises.length > 0) {
                $.each(data.Enterprises, function (key, value) {
                    str += "<p><a href='/Enterprise/Show/" + value.ID + "'>" + value.Title + "</a></p>";
                });
            }
            str += "<p class='es-notification-subtitle'>名录(" + data.Customers.length + ")</p>";
            if (data.Customers.length > 0) {
                $.each(data.Customers, function (key, value) {
                    str += "<p><a href='/Enterprise/Show/" + value.EnterpriseID + "'>" + value.Name + " (" + value.Enterprise + ")</a></p>";
                });
            }
            str += "<p class='es-notification-subtitle'>员工(" + data.Users.length + ")</p>";
            if (data.Users.length > 0) {
                $.each(data.Users, function (key, value) {
                    str += "<p><img src='/User/Avatar/1' /><a href='#" + value.ID + "'>" + value.Name + "</a></p>";
                });
            }
            $("#SearchResult").html(str);
        }
    });
}

$(document).ready(function () {
    $('#txtSearchAll').keyup(function (e) {
        if (e.keyCode == 13) {
            $("#btnAllSearch").click();
        }
    }); 

    $("#btnAllSearch").click(function () {
        Search();
    });

    function LoadEnterprise() {
        if ($("#aenterprise").length <= 0) return;
        ShowLoading();
        $("#aenterprise").html("");
        $("#benterprise").html("");
        $("#centerprise").html("");
        $("#denterprise").html("");
        $.getJSON("/Enterprise/Search", { Text: $("#txtEnterpriseSearch").val() }, function (data) {
            for (var i = 0; i < data.length; i++) {
                var html = '<div class="es-enterprise-item"><a href="/Enterprise/Show/' + data[i].ID + '" class="title">' + data[i].Title + '</a> <a href="javascript:Delete(' + data[i].ID + ')">删除</a></div>';
                var level = data[i].Level;
                if (level == "A")
                    $("#aenterprise").prepend(html);
                else if (level == "B")
                    $("#benterprise").prepend(html);
                else if (level == "C")
                    $("#centerprise").prepend(html);
                else if (level == "D")
                    $("#denterprise").prepend(html);
            }
            HideLoading();
        });
    }

    LoadEnterprise();

    $("#btnEnterpriseSearch").click(function () {
        LoadEnterprise();
    });

    Load();
});

$(window).scroll(function () {
    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        Load();
    }
});

$("form").submit(function (e) {
    $.each($(this).find("input[type='text']"), function (i, item) {
        if ($(item).val() == "" && $(item).attr("name")!="undefined" && !$(item).hasClass("nullable")) {
            if ($(item).attr("placeholder") != null && $(item).attr("placeholder") != "")
                alert($(item).attr("placeholder") + "不能为空！");
            else
                alert($(item).attr("name") + " 不能为空！");
            HideLoading();
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }
    });
});