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

package de.iteratec.osm.measurement.environment

import grails.buildtestdata.mixin.Build
import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import spock.lang.Specification
/**
 * Test-suite for {@link Location}
 */
@TestFor(Location)
@Build([Location, WebPageTestServer, Browser])
@Mock([Location, WebPageTestServer,Browser])
class LocationTests extends Specification {

    void "only labels up to 150 characters are valid"() {
        given: "a location with a valid label with 150 characters"
        Location location = Location.build(label: "*".padLeft(150,"*"))

        when: "the label is updated to a length og 151"
        location.label = "*".padLeft(151,"*")

        then: "the location doesn't validate anymore"
        location.validate() == false
    }

    void "toString includes location, WPT server and browser name, but not the location label"() {
        given: "a WPT server, a browser, and a location associated with them"
        WebPageTestServer server = WebPageTestServer.build(label: 'wpt1')
        Browser browser = Browser.build(name: 'Firefox')
        Location location = Location.build(
                label: 'Agent 1: Offizielles Monitoring',
                location: 'Agent1-wptdriver:Firefox7',
                browser: browser,
                wptServer: server
        )

        when: "toString is called"
        String result = location.toString()

        then: "the result contains the location, server and browser"
        result == "Agent1-wptdriver:Firefox7 @ wpt1 (Firefox)"
    }
}
