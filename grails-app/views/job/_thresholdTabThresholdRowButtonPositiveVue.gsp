<script type="text/x-template" id="threshold-tab-threshold-row-button-positive-vue">
<span class="form-inline">
    <button type="button"
            :class="computedClass"
            @click="onClick(true)">{{computedLabelPositive}}</button>
    <button type="button"
            class="thresholdButton margins btn btn-xs btn-danger"
            @click="onClick(false)">{{computedLabelNegative}}</button>
</span>
</script>

<asset:javascript src="thresholdTabThresholdRowButtonPositiveVue.js"/>