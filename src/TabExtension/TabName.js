/*
    TabName
    ========================
    @file      : TabName.js
    @version   : 3.0.2
    @author    : Andries Smit
    @copyright : Flock of Birds International BV
    @license   : Apache 2.0
*/

define([ "dojo/_base/declare", "dojo/query", "dojo/dom-attr",
    "mxui/widget/_WidgetBase", "dojo/NodeList-traverse" ],
    function(declare, query, domAttr, _WidgetBase) {
        // "use strict";
        return declare("TabExtension.TabName", [ _WidgetBase ], {
            entity: "",
            attribute: "",
            emptyValue: "",
            originalValue: "",

            postMixInProperties: function() {
                // Combine the properties so the FromWidget can handle the rest.
                // Name based Mendix widgets did not update anymore like it did in mx4
                this.attributePath = this.entity + "/" + this.attribute;
                this.inherited(arguments);
            },

            buildRendering: function() {
                // No real function but the _FormWideget needs this node.
                this.readNode = mxui.dom.create("div");
                this.editNode = this.readNode;
                this.inherited(arguments);
            },
			
			// dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
			postCreate: function () {
				console.log(this.id + '.postCreate');
				
				this._setupEvents();
			},
			
			// mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
			update: function (obj, callback) {
				console.log(this.id + '.update');

				this._contextObj = obj;
                
				this._resetSubscriptions();
				this._updateRendering();

				callback();
			},

            _setValueAttr: function() {
                var content = query(this.domNode).closest(".mx-tabcontainer-pane")[0];
                if (content) { // Check if still alive
                    var tabWidget = query(content).closest(".mx-tabcontainer")[0], // Find the Tab widget, in which the name widget is placed
                        pane = query(content).closest(".mx-tabcontainer-pane")[0], // Find the pane the widget is place
                        allPanes = query(".mx-tabcontainer-pane", tabWidget), // Find all panes in this Tab widget
                        tabIndex = allPanes.indexOf(pane), // Find all panes in this Tab widget
                        tabList = query(".mx-tabcontainer-tabs li a", tabWidget), // Will throw exeption on load, function called twice for unknown reason, second time it works
                        tab = tabList[tabIndex];
                    if (tab) {
						var value = this._contextObj.get(this.attribute);
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
			
			_setupEvents: function () {

			},

			_updateRendering: function () {
				this._setValueAttr();
			},
			
			_resetSubscriptions: function () {
				// Release handle on previous object, if any.
				if (this._handle) {
					this.unsubscribe(this._handle);
					this._handle = null;
				}

				if (this._contextObj) {
					this._handle = this.subscribe({
						guid: this._contextObj.getGuid(),
						callback: this._updateRendering
					});
				}
			}
        });
    });

require([ "TabExtension/TabName" ]);
