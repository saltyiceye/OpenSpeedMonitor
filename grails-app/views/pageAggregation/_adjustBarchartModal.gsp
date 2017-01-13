<div class="modal fade" tabindex="-1" role="dialog" id="adjustBarchartModal">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4><g:message code="de.iteratec.chart.adjustment.name" default="adjust chart"/></h4>
            </div>

            <div id="collapseAdjustment" class="modal-body form-horizontal">
                <!-- x axis label -->
                <div class="form-group">
                    <label class="col-sm-2 control-label" for="x-axis-label">
                        <g:message code="de.iteratec.osm.dimple.xAxis.label" default="x-axis label"/>
                    </label>

                    <div class="col-sm-10">
                        <input id="x-axis-label" class="form-control" type="text">
                    </div>
                </div>
                %{-- y axis label --}%
                <div class="form-group">
                    <label class="col-sm-2 control-label"><g:message
                            code="de.iteratec.osm.dimple.yAxis.label"
                            default="y-axis label"/></label>

                    <div class="col-sm-10" id="y-axis-alias-container">

                    </div>
                </div>
                %{-- chart width & height --}%
                <div class="form-group">
                    <label class="col-sm-2 control-label"><g:message
                            code="de.iteratec.osm.dimple.barchart.size.name"
                            default="height"/></label>

                    <div class="col-sm-10">
                        <div class="input-group form-row">
                            <span class="input-group-addon">
                                <g:message code="de.iteratec.chart.width.name"
                                           default="Width"/>
                            </span>
                            <input type="number" class="form-control chartSizeInput" id="inputChartWidth" min="0"
                                   step="1"
                                   data-bind="value:replyNumber">
                            <span class="input-group-addon">px</span>
                        </div>

                        <div class="input-group form-row">
                            <span class="input-group-addon">
                                <g:message code="de.iteratec.chart.height.name"
                                           default="Height"/>
                            </span>
                            <input type="number" class="form-control chartSizeInput" id="inputChartHeight" min="0"
                                   step="1"
                                   data-bind="value:replyNumber">
                            <span class="input-group-addon">px</span>
                        </div>
                    </div>
                </div>
                %{--assign colors--}%
                <div class="form-group">
                    <label class="col-sm-2 control-label"><g:message
                            code="de.iteratec.osm.dimple.barchart.assignColors.name"
                            default="Assign Colors"/></label>

                    <div class="col-sm-10" id="assign-color-container">

                    </div>
                </div>
                %{--toggle chart axes and gridlines--}%
                <div class="form-group">
                    <div class="btn-group col-sm-offset-2 col-sm-10" data-toggle="buttons">
                        <label class="btn btn-default">
                            <input type="checkbox" id="inputShowGridlines"><g:message
                                code="de.iteratec.osm.dimple.barchart.adjustChart.showGridlines"
                                default="Show Gridlines"/>
                        </label>

                        <label class="btn btn-default">
                            <input type="checkbox" id="inputShowYAxis"><g:message
                                code="de.iteratec.osm.dimple.barchart.adjustChart.showYAxis"
                                default="Show y-Axis"/>
                        </label>

                        <label class="btn btn-default">
                            <input type="checkbox" id="inputShowXAxis"><g:message
                                code="de.iteratec.osm.dimple.barchart.adjustChart.showXAxis"
                                default="Show x-Axis"/>
                        </label>

                        <label class="btn btn-default">
                            <input type="checkbox" id="inputShowBarLabels"><g:message
                                code="de.iteratec.osm.dimple.barchart.adjustChart.showBarLabels"
                                default="Show Barlabels"/>
                        </label>
                    </div>
                </div>
            </div>

            <div class="hidden input-group colorpicker-component form-row" id="assign-color-clone">
                <span class="colorLabel input-group-addon"></span>
                <input type="text" value="#FFFFFF" class="form-control"/>
                <span class="input-group-addon colorpicker-target"><i></i></span>
            </div>

            <div class="hidden" id="y-axis-alias-clone">
                <input class="labelInput form-control form-row" type="text">
                <input class="hidden unitInput" type="text">
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"><g:message
                        code="de.iteratec.ism.ui.button.close" default="close"/></button>
                <button type="button" class="btn btn-primary" id="adjustBarchartApply" onclick="adjustBarchartApply()">
                    <g:message code="de.iteratec.ism.ui.button.apply.name"/>
                </button>
            </div>
        </div>
    </div>
</div>

<asset:script type="text/javascript">
    function initModalDialogValues() {
        var chart = OpenSpeedMonitor.ChartModules.PageAggregationBarChart;
        $("#x-axis-label").val(chart.getXLabel());
        $("#inputChartWidth").val(chart.getWidth());
        $("#inputChartHeight").val(chart.getHeight());
        if (chart.getShowXAxis()) $("#inputShowXAxis").parent().addClass('active');
        if (chart.getShowYAxis()) $("#inputShowYAxis").parent().addClass('active');
        if (chart.getShowGridlines()) $("#inputShowGridlines").parent().addClass('active');
        if (chart.getShowBarLabels()) $("#inputShowBarLabels").parent().addClass('active');
        $("#assign-color-container").empty();
        $("#y-axis-alias-container").empty();
        var colorAssignments = chart.getColorAssignments();
        colorAssignments.forEach(function(assignment) {
            var clone = $("#assign-color-clone").clone();
            clone.removeAttr("id");
            clone.removeClass("hidden");
            clone.appendTo($("#assign-color-container"));
            clone.find(".colorLabel").html(assignment.label);
            clone.find("input").val(assignment.color);
        });
        $('.colorpicker-component').colorpicker({component: '.colorpicker-target'});
        var yLabels = chart.getYLabels();
        yLabels.forEach(function(label) {
            var clone = $("#y-axis-alias-clone").clone();
            clone.removeAttr("id");
            clone.removeClass("hidden");
            clone.appendTo($("#y-axis-alias-container"));
            clone.find("label").html(label.label);
            clone.find("input.labelInput").val(label.label);
            clone.find("input.unitInput").val(label.unit);
        });
    }

    function adjustBarchartApply() {
        OpenSpeedMonitor.ChartModules.PageAggregationBarChart.adjustChart();
        $('#adjustBarchartModal').modal('hide');
    }
</asset:script>