package geb.pages.de.iteratec.osm.measurement.environment

import de.iteratec.osm.measurement.environment.BrowserAlias
import geb.pages.de.iteratec.osm.I18nGebPage

class BrowserAliasIndexPage extends I18nGebPage {
    static url = getUrl("/browserAlias/index")

    static at = {
        title == getI18nMessage("default.list.label", [BrowserAlias.simpleName])

        $("#Menu .active a").attr("href").contains("/browserAlias/index")
    }

    static content = {
        successDiv { $("div", class: "alert alert-info") }
        successDivText { successDiv[0].attr("innerHTML") }

        browserAliasTableRows { $("#list-browserAlias").$("tbody").$("tr") }

        pageButtons { $(".pagination").$("li") }
    }
}
