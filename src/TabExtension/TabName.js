/*jslint browser: true, devel:true, nomen:true, unparam:true, regexp: true*/
/*global define, require, mxui, mx, logger*/

/*
    TabName
    ========================
    @file      : TabName.js
    @version   : 2.1
    @author    : Andries Smit
    @date      : 18 May 2016
    @copyright : Flock of Birds International BV
    @license   : MIT
*/

define(["dojo/_base/declare", "dojo/query", "dojo/dom-attr",
     "mxui/widget/_FormWidget", "dojo/NodeList-traverse"],
    function (declare, query, domAttr, _FormWidget) {
        //"use strict";
        return declare("TabExtension.TabName", [ _FormWidget ], {
            entity: "",
            attribute: "",
            emptyValue: "",

            postMixInProperties: function () {
                // Combine the properties so the FromWidget can handle the rest.
                // Name based Mendix widgets did not update anymore like it did in mx4
                this.attributePath = this.entity + "/" + this.attribute;
                this.inherited(arguments);
            },

            buildRendering: function () {
                // No real function but the _FormWideget needs this node.
                this.readNode = mxui.dom.create("div");
                this.inherited(arguments);
            },

            _setValueAttr: function (value) {
                // on value set or change this function wil update the value of the tab label
                var content = query(this.domNode).closest(".mx-tabcontainer-pane")[0];
                if (content) { //check if still alive
                    domAttr.set(content, "title", value);
                    // find the Tab widget, in which the name widget is placed
                    var tabWidget = query(content).closest(".mx-tabcontainer")[0];
                    // find the pane the widget is place
                    var pane = query(content).closest(".mx-tabcontainer-pane")[0];
                    // find all panes in this Tab widget
                    var allPanes = query(".mx-tabcontainer-pane", tabWidget);

                    var tabIndex = allPanes.indexOf(pane);
                    // will throw exeption on load, function called twice for unknown reason, second time it works
                    var tabList = query(".mx-tabcontainer-tabs li a", tabWidget);
                    var tab = tabList[tabIndex];
                    if (tab) {
                        // Store original title [Axel Brink 2016-08-19]
                        var origcaption = domAttr.get(tab, "origcaption");
                        if (!origcaption) {
                            origcaption = tab.innerHTML;
                            domAttr.set(tab, "origcaption", origcaption);
                        }

                        if (value) {
                            tab.innerHTML = origcaption.replace("\{1\}", value);
                        } else {
                            tab.innerHTML = this.emptyValue;
                        }
                    } else {
                        console.error("No tab found on index " + tabIndex);
                    }
                }
            }
        });
    });

require(["TabExtension/TabName"]);