/*global mx, mxui, logger, require*/
/*
    WidgetName
    ========================
    @file      : TabButton.js
    @version   : 2.1
    @author    : Andries Smit
    @date      : 05 Nov 2015
    @copyright : Flock of Birds International BV
    @license   : MIT
*/

mxui.dom.addCss(require.toUrl("TabExtension/ui/vertical-tabs.css"));

define(["dojo/_base/declare", "mxui/widget/_WidgetBase", "dojo/query", "dojo/_base/event", "dojo/_base/lang",
    "dojo/dom-construct", "dojo/dom-class", "dojo/on", "dojo/dom-geometry", "dojo/dom-style"], 
    function(declare, _WidgetBase, query, event, lang, domConstruct, domClass, on, domGeom, domStyle) {
    "use strict";
    return declare("TabExtension.TabButton", [  _WidgetBase ],{
        
        // Parameters configured in the Modeler.
        tabButtons: [],
        moreTab: true,
        moreCaption: "More",
        
        //
        handlers: [],
        context: null,
        tabContainer: null,
        dropDown: null,
        dropDownMenu: null,
        dropDownTab: null,
        tabsInMenu: null,
        allTabs: null,
        width: 0,

        containerSelector: ".mx-tabcontainer-tabs",
        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function() {
            this.tabsInMenu = [];
            this.allTabs = [];
        },
        
        postCreate: function() {
            // find tab dat is placed in table cell above widget.
            var colindex = this.domNode.parentNode.cellIndex;
            var tabCell = this.domNode.parentNode.parentNode.previousSibling.cells[colindex];
            this.tabContainer = query(this.containerSelector, tabCell)[0];
            if (this.tabContainer) {
                this.setupMoreButton();
                this.addButtons();
            } else {
                console.error("Could not find tab container with selector: '" + this.containerSelector + "'");
            }
        },

        setupMoreButton: function() {
            if (this.moreTab) {
                var $ = mxui.dom.create;
                this.dropDownMenu = $("ul", {
                    "class": "dropdown-menu"
                });
                this.dropDown = $("a", {
                    "class": "dropdown-toggle",
                    "data-toggle": "dropdown",
                    "href": "#"
                }, this.moreCaption, $("b", {
                    "class": "caret"
                }));
                this.dropDownTab = $("li", {
                    "class": "dropdown pull-right tabdrop",
                    "style": "visibility:hidden;"
                }, this.dropDownMenu, this.dropDown);

                //open dropdown on click
                this.own(on(this.dropDown, "click", lang.hitch(this, function(e) {
                    domClass.toggle(this.dropDownTab, "open");
                    event.stop(e);
                })));
                // close dropdown on any other click
                this.own(on(window, "click", lang.hitch(this, function(e) {
                    domClass.remove(this.dropDownTab, "open");
                })));
                // place at first so it will not moved to next line.
                domConstruct.place(this.dropDownTab, this.tabContainer, "first");
                var rightMargin = null;
                query("li:not(.tabdrop)", this.tabContainer).forEach(lang.hitch(this, function(node) {
                    this.own(on(node, "click", lang.hitch(this, function(node, e) {
                        // set / remove dropdown tab active if a tab is selected
                        if (node.parentNode === this.dropDownMenu) {
                            domClass.add(this.dropDownTab, "active");
                        } else {
                            domClass.remove(this.dropDownTab, "active");
                        }
                    }, node)));

                    // relative margins needed due in case page start with tabs on new line.
                    if (!rightMargin)
                        rightMargin = domGeom.getMarginBox(node).l + domGeom.getMarginBox(node).w;
                    else
                        rightMargin += domGeom.getMarginBox(node).w;
                    var itemInfo = {};
                    itemInfo.node = node;
                    itemInfo.right = rightMargin;
                    this.allTabs.push(itemInfo);
                }));

                this.width = this.mxform.domNode.clientWidth; // set initial width
                this.connect(this.mxform, "resize", this.updateMoreTab);
            }
        },

        updateMoreTab: function() {
            var increaceSize = false;
            if (this.width < this.mxform.domNode.clientWidth) {
                increaceSize = true;
            }
            this.width = this.mxform.domNode.clientWidth;
            var collection = document.createDocumentFragment();
            var newMenuItems = [];
            if (!increaceSize) {
                query("li:not(.tabdrop)", this.tabContainer).forEach(lang.hitch(this, function(node) {
                    // find tab items that are dropped into next line.
                    // query selector can not check if item is placed in the more menu
                    if (node.offsetTop > this.dropDownTab.offsetTop && this.tabsInMenu.indexOf(node) === -1 ) {                        
                        collection.appendChild(node);
                        newMenuItems.push(node);
                    }
                }));
                if (newMenuItems.length > 0) { // Add new dropdown items
                    domConstruct.place(collection, this.dropDownMenu, "first");
                    this.tabsInMenu = newMenuItems.concat(this.tabsInMenu);
                }
            }

            if (increaceSize && this.tabsInMenu.length > 0) { // Check if menu items need to return to the tabs
                var marginDropTabLeft = domGeom.position(this.dropDownTab).x;
                for (var i = 0; i < this.tabsInMenu.length; i++) {
                    for (var j = 0; j < this.allTabs.length; j++) {
                        var t = this.allTabs[j];
                        if (t.node === this.tabsInMenu[i] && t.right < marginDropTabLeft -10) {
                            // enough space, add
                            this.tabContainer.appendChild(this.tabsInMenu[i]);
                            this.tabsInMenu.splice(i, 1);
                            i--; //decrement because of removing item. 
                        }
                    }
                }
            }

            if (query(".active", this.dropDownMenu).length === 1) { //set tab active when menu item is active
                domClass.add(this.dropDownTab, "active");
            } else {
                domClass.remove(this.dropDownTab, "active");
            }

            if (this.dropDownMenu.childElementCount === 0) { // hide/show menu when empty
                domStyle.set(this.dropDownTab, "visibility", "hidden");
            } else {
                domStyle.set(this.dropDownTab, "visibility", "");
            }
        },

        addButtons: function() {
            // add the buttons next to the tabs
            var $ = mxui.dom.create;
            for (var i = 0; i < this.tabButtons.length; i++) {
                var b = this.tabButtons[i];
                if (b.displayAs === "button" || b.displayAs === "link") {
                    var classes = typeof(b.classname) === "undefined" ? "" : b.classname;
                    if (b.displayAs === "button")
                        classes = b.buttonStyle === "default" ? classes : classes + " btn-" + b.buttonStyle;

                    var mxbutton = new mxui.widget._Button({
                        "caption": b.caption,
                        "iconUrl": b.image,
                        "renderType": b.displayAs,
                        "class": classes,
                        "onClick": lang.hitch(this, this.onclickEvent, b.microflow)
                    });

                    var align = b.align === "right" ? {
                        "class": "pull-right"
                    } : {};
                    var xtraButton = $("li", align, mxbutton.domNode);

                    this.tabContainer.appendChild(xtraButton);

                } else if (b.displayAs === "tab") {
                    var img = typeof(b.caption) === "undefined" ? "" : $("img", {
                        "src": b.image
                    });;
                    if (img && b.altText)
                        img.alt = b.altText;
                    var caption = typeof(b.caption) === "undefined" ? "" : b.caption;
                    var classes = typeof(b.classname) === "undefined" ? "" : b.classname;
                    var xtraTab = $("li", {
                        class: classes
                    }, $("a", {
                        "href": "#"
                    }, img, caption));
                    this.handlers.push(on(xtraTab, "click", lang.hitch(this, this.onclickEvent, b.microflow)));

                    this.tabContainer.appendChild(xtraTab);
                }
            }
        },

        onclickEvent: function(mf, e) {
            // handle the microflow call
            mx.data.action({
                params: {
                    actionname: mf
                },
                callback: function() {},
                error: function() {
                    logger.error("TabButton onclickEvent: XAS error executing microflow");
                },
                context: this.mxcontext
            });
            event.stop(e);
        }
    });
});

require(["TabExtension/TabButton"], function() {
    "use strict";
});