define([ "dojo/_base/declare", "dojo/query", "dojo/_base/lang",
    "mxui/widget/_WidgetBase", "dojo/NodeList-traverse" ],
    function(declare, query, lang, _WidgetBase) {
        // "use strict";
        return declare("TabExtension.TabName", [ _WidgetBase ], {
            attribute: "",
            emptyValue: "",
            originalValue: "",

            update: function(obj, callback) {
                logger.debug(this.id + ".update");
                this._contextObj = obj;
                this._resetSubscriptions();
                this._updateRendering();
                callback && callback();
            },

            _updateRendering: function() {
                var value = "";
                if (this._contextObj) {
                    value = this._contextObj.get(this.attribute);
                }
                this._setValueAttr(value);
            },

            _setValueAttr: function(value) {
                // On value set or change this function wil update the value of the tab label
                var content = query(this.domNode).closest(".mx-tabcontainer-pane")[0];
                if (content) { // Check if still alive
                    var tabWidget = query(content).closest(".mx-tabcontainer")[0], // Find the Tab widget, in which the name widget is placed
                        pane = query(content).closest(".mx-tabcontainer-pane")[0], // Find the pane the widget is place
                        allPanes = query(".mx-tabcontainer-pane", tabWidget), // Find all panes in this Tab widget
                        tabIndex = allPanes.indexOf(pane), // Find all panes in this Tab widget
                        tabList = query(".mx-tabcontainer-tabs li a", tabWidget), // Will throw exeption on load, function called twice for unknown reason, second time it works
                        tab = tabList[tabIndex];
                    if (tab) {
                        tab.innerHTML = this.getValue(tab, value);
                    } else {
                        logger.error("No tab found on index " + tabIndex);
                    }
                }
            },

            getValue: function(tab, defaultValue) {
                var value = defaultValue;
                if (!this.originalValue) {
                    this.originalValue = tab.innerHTML;
                }
                if (value) {
                    if (this.useTemplate) {
                        value = this.originalValue.replace("{1}", value);
                    }
                } else {
                    if (this.useTemplate) {
                        value = this.originalValue.replace("{1}", this.emptyValue);
                    }
                    value = this.emptyValue;
                }
                return value;
            },

            _resetSubscriptions: function() {
                logger.debug(this.id + "._resetSubscriptions");
                this.unsubscribeAll();

                if (this._contextObj) {
                    this.subscribe({
                        guid: this._contextObj.getGuid(),
                        callback: lang.hitch(this, function(guid) {
                            this._updateRendering();
                        })
                    });

                    this.subscribe({
                        guid: this._contextObj.getGuid(),
                        attr: this.attribute,
                        callback: lang.hitch(this, function() {
                            this._updateRendering();
                        })
                    });
                }
            }
        });
    });

require([ "TabExtension/TabName" ]);
