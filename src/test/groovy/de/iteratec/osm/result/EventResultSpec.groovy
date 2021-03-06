/* 
* OpenSpeedMonitor (OSM)
* Copyright 2014 iteratec GmbH
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
* 	http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software 
* distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
* See the License for the specific language governing permissions and 
* limitations under the License.
*/

package de.iteratec.osm.result

import de.iteratec.osm.measurement.schedule.ConnectivityProfile
import de.iteratec.osm.measurement.script.Script
import grails.buildtestdata.BuildDataTest
import grails.buildtestdata.mixin.Build
import spock.lang.Specification

@Build([EventResult, JobResult])
class EventResultSpec extends Specification implements BuildDataTest {
    void setupSpec() {
        mockDomains(EventResult, JobResult, ConnectivityProfile, Script)
    }

    def "build test details url and validate url"() {
        given: "an Event Result and a Job Result"
        EventResult eventResult = EventResult.build(numberOfWptRun: 1, cachedView: CachedView.CACHED)
        JobResult jobResult = JobResult.build(testId: "12_3", wptServerBaseurl: "http://www.example.com/")

        when: "the wpt details url gets build"
        URL url = eventResult.buildTestDetailsURL(jobResult, "#waterfall_view")

        then: "the returned url coincide with Event Result and Job Result parameters"
        url.toString() == "http://www.example.com/details.php?test=12_3&run=1&cached=1#waterfall_view"
    }
}
