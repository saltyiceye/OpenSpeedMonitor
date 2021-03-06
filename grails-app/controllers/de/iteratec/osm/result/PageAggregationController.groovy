package de.iteratec.osm.result

import de.iteratec.osm.OsmConfigCacheService
import de.iteratec.osm.annotations.RestAction
import de.iteratec.osm.barchart.BarchartAggregation
import de.iteratec.osm.barchart.BarchartAggregationService
import de.iteratec.osm.barchart.GetBarchartCommand
import de.iteratec.osm.csi.Page
import de.iteratec.osm.measurement.schedule.Job
import de.iteratec.osm.measurement.schedule.JobDaoService
import de.iteratec.osm.measurement.schedule.JobGroup
import de.iteratec.osm.measurement.schedule.JobGroupService
import de.iteratec.osm.measurement.script.PlaceholdersUtility
import de.iteratec.osm.measurement.script.Script
import de.iteratec.osm.measurement.script.ScriptParser
import de.iteratec.osm.result.dto.PageAggregationChartDTO
import de.iteratec.osm.result.dto.PageAggregationChartSeriesDTO
import de.iteratec.osm.util.ControllerUtils
import de.iteratec.osm.util.ExceptionHandlerController
import de.iteratec.osm.util.I18nService
import de.iteratec.osm.util.PerformanceLoggingService
import org.springframework.http.HttpStatus

class PageAggregationController extends ExceptionHandlerController {

    public final static String DATE_FORMAT_STRING_FOR_HIGH_CHART = 'dd.mm.yyyy';
    public final static int MONDAY_WEEKSTART = 1

    JobGroupService jobGroupService
    JobDaoService jobDaoService
    EventResultDashboardService eventResultDashboardService
    I18nService i18nService
    PageService pageService
    OsmConfigCacheService osmConfigCacheService
    BarchartAggregationService barchartAggregationService
    PerformanceLoggingService performanceLoggingService

    def index() {
        redirect(action: 'show')
    }

    def show() {
        Map<String, Object> modelToRender = [:]

        // AggregatorTypes
        modelToRender.put('aggrGroupValuesUnCached', SelectedMeasurand.createDataMapForOptGroupSelect())

        // JobGroups
        List<JobGroup> jobGroups = eventResultDashboardService.getAllJobGroups()
        modelToRender.put('folders', jobGroups)
        modelToRender.put('selectedFolder', params.selectedFolder)

        // Pages
        List<Page> pages = eventResultDashboardService.getAllPages()
        modelToRender.put('pages', pages)
        modelToRender.put('selectedPages', params.selectedPages)

        // JavaScript-Utility-Stuff:
        modelToRender.put("dateFormat", DATE_FORMAT_STRING_FOR_HIGH_CHART)
        modelToRender.put("weekStart", MONDAY_WEEKSTART)

        modelToRender.put('selectedAggrGroupValuesUnCached', [])

        modelToRender.put("tagToJobGroupNameMap", jobGroupService.getTagToJobGroupNameMap())

        // Done! :)
        return modelToRender
    }

    def entryAndFollow() {
        return [:]
    }

    /**
     * Rest Method for ajax call.
     * @param cmd The requested data.
     * @return PageAggregationChartDTO as JSON or string message if an error occurred
     */
    @RestAction
    def getBarchartData(GetBarchartCommand cmd) {
        String errorMessages = getErrorMessages(cmd)
        if (errorMessages) {
            ControllerUtils.sendSimpleResponseAsStream(response, HttpStatus.BAD_REQUEST, errorMessages)
            return
        }

        List<JobGroup> allJobGroups = null
        if (cmd.selectedJobGroups) {
            allJobGroups = JobGroup.findAllByNameInList(cmd.selectedJobGroups)
        }
        List<Page> allPages = null
        if (cmd.selectedPages) {
            allPages = Page.findAllByNameInList(cmd.selectedPages)
        }

        List<BarchartAggregation> barchartAggregations = barchartAggregationService.getBarchartAggregationsFor(cmd)

        // return if no data is available
        boolean hasComparativeData = barchartAggregations.any { it.valueComparative != null }
        if (!barchartAggregations.any { it.value != null } && !hasComparativeData) {
            ControllerUtils.sendObjectAsJSON(response, [:])
            return
        }

        PageAggregationChartDTO chartDto = new PageAggregationChartDTO(hasComparativeData: hasComparativeData)
        chartDto.i18nMap.put("measurand", i18nService.msg("de.iteratec.result.measurand.label", "Measurand"))
        chartDto.i18nMap.put("jobGroup", i18nService.msg("de.iteratec.isr.wptrd.labels.filterFolder", "JobGroup"))
        chartDto.i18nMap.put("page", i18nService.msg("de.iteratec.isr.wptrd.labels.filterPage", "Page"))
        chartDto.i18nMap.put("comparativeImprovement", i18nService.msg("de.iteratec.osm.chart.comparative.improvement", "Improvement"))
        chartDto.i18nMap.put("comparativeDeterioration", i18nService.msg("de.iteratec.osm.chart.comparative.deterioration", "Deterioration"))

        chartDto.series.addAll(convertToPageAggregationChartSeriesDTOs(barchartAggregations))

//      TODO: see ticket [IT-1614]
        chartDto.filterRules = createFilterRules(allPages, allJobGroups)
//        barchartDTO.filterRules = filteringAndSortingDataService.createFilterRules(allPages, allJobGroups)

        if (!chartDto.series) {
            ControllerUtils.sendSimpleResponseAsStream(
                response,
                HttpStatus.OK,
                i18nService.msg("de.iteratec.ism.no.data.on.current.selection.heading", "No data")
            )
        } else {
            ControllerUtils.sendObjectAsJSON(response, chartDto)
        }
    }

    @RestAction
    def getEntryAndFollowBarchartData() {

        JobGroup jobGroup = JobGroup.findByName('develop_Desktop')
        List<Job> jobs = jobDaoService.getJobs(jobGroup)
        Set<Page> uniqueTestedPages = [] as Set

        jobs*.script.each { Script script ->
            List<Page> pagesOfThisScript = new ScriptParser(pageService, script.navigationScript, script.label).getTestedPages()
            uniqueTestedPages.addAll(pagesOfThisScript)
        }
        uniqueTestedPages.each {

        }
    }

    private List<PageAggregationChartSeriesDTO> convertToPageAggregationChartSeriesDTOs(List<BarchartAggregation> barchartAggregations) {
        return barchartAggregations.collectMany {
            if (!it.value) {
                return []
            } else {
                return [new PageAggregationChartSeriesDTO(
                    unit: it.selectedMeasurand.getMeasurandGroup().unit.label,
                    measurandLabel: i18nService.msg("de.iteratec.isr.measurand.${it.selectedMeasurand.name}", it.selectedMeasurand.name),
                    measurand: it.selectedMeasurand.name,
                    measurandGroup: it.selectedMeasurand.getMeasurandGroup(),
                    value: it.value,
                    valueComparative: it.valueComparative,
                    page: it.page.name,
                    jobGroup: it.jobGroup.name,
                    aggregationValue: it.aggregationValue
                )]
            }
        }
    }

    /**
     * Creates Filter Rules for given Pages and JobGroups.
     * The filterRules can filter the data by testedPages in {@link Script}
     * @return a map which maps the {@link Script}-name to a list of page-jobGroup-name-combinations (e.g. ["script1" : ["page1 / jobGroup1"]])
     */
    private Map<String, List<Map<String, String>>> createFilterRules(List<Page> pages, List<JobGroup> jobGroups) {
        Map<String, List<String>> result = [:]

        // Get all scripts
        List<Job> jobList = jobDaoService.getJobs(jobGroups)
        List<Script> allScripts = jobList*.script.unique()

        allScripts.each { currentScript ->
            List<String> filterRule = []
            List<Page> testedPages = []
            List<List<Page>> testedPagesPerJob = []

            jobList.findAll { it.script == currentScript }.each { j ->
                testedPagesPerJob << new ScriptParser(pageService, PlaceholdersUtility.getParsedNavigationScript(currentScript.navigationScript, j.variables), currentScript.label).getTestedPages().unique()
            }

            // if all lists are equal take any
            // else merge lists
            if (testedPagesPerJob.every { it.equals(testedPagesPerJob[0]) }) {
                testedPages = testedPagesPerJob[0]
            } else {
                testedPages = getOrderedPagesOfAllScripts(testedPagesPerJob)
            }

            testedPages.each { p ->
                if (pages.contains(p)) {
                    jobGroups.each {
                        filterRule << [page: p.name, jobGroup: it.name]
                    }
                }
            }

            if (filterRule)
                result.put(currentScript.label, filterRule)
        }

        return result
    }

    /**
     * Merges multiple lists of pages by collecting all pages of each list, filtering out duplicates
     * and keeping the order
     *
     * E.g.:
     * List1 = ["a", "b",       "c"]
     * List2 = ["a", "c",       "c"]
     * List2 = ["a", "b",       "d"]
     *
     * Result = ["a", "b", "c", "c", "d"]
     *
     * @param listOfPages A list of scripts where each item is a list of pages which are measured in that particular script
     * @return
     */
    private List<Page> getOrderedPagesOfAllScripts(List<List<Page>> listOfPages) {
        List<Page> orderedPagesOfAllScripts = []
        int sizeOfLongestPageList = listOfPages*.size().max()

        sizeOfLongestPageList.times { pageStep ->
            List<Page> pagesOfCurrentStep = listOfPages*.getAt(pageStep).flatten()
            pagesOfCurrentStep.unique(true).removeAll([null])

            orderedPagesOfAllScripts.addAll(pagesOfCurrentStep)
        }

        return orderedPagesOfAllScripts
    }

    /**
     * Validates the command and creates an error message string if necessary.
     * @param cmd
     * @return a string containing the error messages in html format or an empty string if the command is valid
     */
    private String getErrorMessages(GetBarchartCommand cmd) {
        String result = ""
        if (!cmd.selectedSeries) {
            result += i18nService.msg("de.iteratec.osm.gui.selectedMeasurandSeries.error.validator.error.selectedMeasurandSeries", "Please select at least one measurand series")
            result += "<br />"
        }
        if (!cmd.selectedPages) {
            result += i18nService.msg("de.iteratec.osm.gui.selectedPage.error.validator.error.selectedPage", "Please select at least one page")
            result += "<br />"
        }
        if (!cmd.selectedJobGroups) {
            result += i18nService.msg("de.iteratec.osm.gui.selectedFolder.error.validator.error.selectedFolder", "Please select at least one jobGroup")
            result += "<br />"
        }
        return result
    }
}
