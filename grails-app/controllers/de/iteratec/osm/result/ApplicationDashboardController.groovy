package de.iteratec.osm.result

import de.iteratec.osm.util.ControllerUtils
import grails.validation.Validateable
import org.joda.time.DateTime

class ApplicationDashboardController {

    final static FOUR_WEEKS = 4

    ApplicationDashboardService applicationDashboardService

    def getPagesForApplication(PagesForApplicationCommand command) {

        DateTime from = new DateTime().minusWeeks(FOUR_WEEKS)
        DateTime to = new DateTime()
        def pages = applicationDashboardService.getPagesWithResultsOrActiveJobsForJobGroup(from, to, command.applicationId)

        return ControllerUtils.sendObjectAsJSON(response, pages)
    }
}

class PagesForApplicationCommand implements Validateable {
    Long applicationId

    static constraints = {
        applicationId(nullable: false)
    }
}
