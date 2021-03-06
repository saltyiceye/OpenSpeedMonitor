//= require jobGroupAggregationChart.js
//= require_self

"use strict";

var OpenSpeedMonitor = OpenSpeedMonitor || {};
OpenSpeedMonitor.ChartModules = OpenSpeedMonitor.ChartModules || {};
OpenSpeedMonitor.ChartModules.GuiHandling = OpenSpeedMonitor.ChartModules.GuiHandling || {};

OpenSpeedMonitor.ChartModules.GuiHandling.jobGroupAggregation = (function () {
    var jobGroupAggregationChart = OpenSpeedMonitor.ChartModules.JobGroupAggregationHorizontal("#job-group-aggregation-svg");
    var spinner = OpenSpeedMonitor.Spinner("#chart-container");
    var drawGraphButton = $("#graphButtonHtmlId");
    var avgLoaded = false;
    var medianLoaded = false;

    var init = function () {
        drawGraphButton.on('click', function () {
            $("#chart-card").removeClass("hidden");
            loadData(true);
        });
        $(window).on('historyStateLoaded', function () {
            loadData(false);
        });
        $(window).on('resize', function () {
            jobGroupAggregationChart.setData({});
            jobGroupAggregationChart.render();
        });
        $("input[name='aggregationValue']").on("change", function () {
            spinner.start();
            renderChart({aggregationValue: getAggregationValue()}, true, true);
        });
        $(".chart-filter").on('click', onFilterClick);
    };

    var getSelectedFilter = function () {
        return $(".chart-filter.selected").data("filter");
    };

    var getAggregationValue = function () {
        return $('input[name=aggregationValue]:checked').val()
    };

    var onFilterClick = function (event) {
        event.preventDefault();
        $(".chart-filter").toggleClass('selected', false);
        $(this).toggleClass('selected', true);
        renderChart({activeFilter: $(this).data("filter")}, true);
    };

    var handleNewData = function (data, isStateChange) {
        $("#chart-card").removeClass("hidden");
        $("#error-div").toggleClass("hidden", true);

        if ($.isEmptyObject(data)) {
            $('#warning-no-data').show();
            return;
        }

        $('#warning-no-data').hide();
        data.width = -1;
        data.activeFilter = getSelectedFilter();
        data.aggregationValue = getAggregationValue();

        renderChart(data, isStateChange);
        $("#dia-save-chart-as-png").removeClass("disabled");
    };

    var renderChart = function (data, isStateChange, isAggregationValueChange) {
        if(avgLoaded && getAggregationValue() === "avg") {
            spinner.stop()
        }
        if(medianLoaded && getAggregationValue() === "median"){
            spinner.stop()
        }
        if (data) {
            jobGroupAggregationChart.setData(data);
            if (isStateChange) {
                $(window).trigger("historyStateChanged");
            }
        }
        if (!data.groupData) jobGroupAggregationChart.render(isAggregationValueChange);
        if (data.groupData && getAggregationValue() === data.groupData[0].aggregationValue) {
            jobGroupAggregationChart.render(isAggregationValueChange);
        }
    };

    var loadData = function (isStateChange) {
        jobGroupAggregationChart.resetData();
        avgLoaded = false;
        medianLoaded = false;

        var selectedTimeFrame = OpenSpeedMonitor.selectIntervalTimeframeCard.getTimeFrame();
        var selectedSeries = OpenSpeedMonitor.BarchartMeasurings.getValues();

        var queryData = {
            from: selectedTimeFrame[0].toISOString(),
            to: selectedTimeFrame[1].toISOString(),
            selectedJobGroups: JSON.stringify($.map($("#folderSelectHtmlId option:selected"), function (e) {
                return $(e).text()
            })),
            selectedSeries: JSON.stringify(selectedSeries)
        };

        spinner.start();
        getDataForAggregationValue("median", queryData, isStateChange);
        getDataForAggregationValue("avg", queryData, isStateChange);
    };

    function getDataForAggregationValue(aggregationValue, queryData, isStateChanged) {
        queryData.selectedAggregationValue = aggregationValue;
        $.ajax({
            type: 'POST',
            data: queryData,
            url: OpenSpeedMonitor.urls.jobGroupAggregationGetData,
            dataType: "json",
            success: function (data) {
                if (aggregationValue === "avg") {
                    avgLoaded = true;
                } else {
                    medianLoaded = true;
                }
                handleNewData(data, isStateChanged);
            },
            error: function (e) {
                spinner.stop();
                $("#chart-card").removeClass("hidden");
                if (e.responseText === "no data") {
                    $("#error-div").addClass("hidden");
                    $('#warning-no-data').show();
                }
                else {
                    $("#error-div").removeClass("hidden");
                    $("#error-message").html(e.responseText);
                }
            }
        });
    }

    init();
    return {};
})();
