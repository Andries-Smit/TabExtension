/* global define, require, mxui, mx, logger */

/*
    TabButton
    ========================
    @file      : TabButton.js
    @version   : 2.2.0
    @author    : Andries Smit
    @date      : 18 Aug 2016
    @copyright : Flock of Birds International BV
    @license   : MIT
*/

mxui.dom.addCss(require.toUrl("TabExtension/ui/vertical-tabs.css"));

define(["dojo/_base/declare", "mxui/widget/_WidgetBase", "dojo/query", "dojo/_base/event", "dojo/_base/lang",
    "dojo/dom-construct", "dojo/dom-class", "dojo/on", "dojo/dom-geometry", "dojo/dom-style"],
    function (declare, _WidgetBase, query, event, lang, domConstruct, domClass, on, domGeom, domStyle) {
        "use strict";
        return declare("TabExtension.TabButton", [_WidgetBase], {

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
            constructor: function () {
                this.tabsInMenu = [];
                this.allTabs = [];
            },

            postCreate: function () {
                // find tab dat is placed in table cell above widget.
                var colindex = this.domNode.parentNode.cellIndex,
                    tabCell = this.domNode.parentNode.parentNode.previousSibling.cells[colindex];
                this.tabContainer = query(this.containerSelector, tabCell)[0];
                if (this.tabContainer) {
                    this.setupMoreButton();
                    this.addButtons();
                } else {
                    console.error("Could not find tab container with selector: '" + this.containerSelector + "'");
                }
            },

            setupMoreButton: function () {
                // create dropdown menu
                if (this.moreTab) {
                    var create = mxui.dom.create,
                        rightMargin = null;
                    this.dropDownMenu = create("ul", {
                        class: "dropdown-menu"
                    });
                    this.dropDown = create("a", {
                        class: "dropdown-toggle",
                        "data-toggle": "dropdown",
                        href: "#"
                    }, this.moreCaption, create("b", {
                        class: "caret"
                    }));
                    this.dropDownTab = create("li", {
                        class: "dropdown pull-right tabdrop",
                        style: "visibility:hidden;"
                    }, this.dropDownMenu, this.dropDown);

                    // open dropdown on click
                    this.own(on(this.dropDown, "click", lang.hitch(this, function (evt) {
                        domClass.toggle(this.dropDownTab, "open");
                        event.stop(evt);
                    })));
                    // close dropdown on any other click
                    this.own(on(window, "click", lang.hitch(this, function (evt) {
                        domClass.remove(this.dropDownTab, "open");
                    })));
                    // place at first so it will not moved to next line.
                    domConstruct.place(this.dropDownTab, this.tabContainer, "first");

                    query("li:not(.tabdrop)", this.tabContainer).forEach(lang.hitch(this, function (node) {
                        this.own(on(node, "click", lang.hitch(this, function (node, evt) {
                            // set / remove dropdown tab active if a tab is selected
                            if (node.parentNode === this.dropDownMenu) {
                                domClass.add(this.dropDownTab, "active");
                            } else {
                                domClass.remove(this.dropDownTab, "active");
                            }
                        }, node)));

                        // relative margins needed due in case page start with tabs on new line.
                        if (!rightMargin) {
                            rightMargin = domGeom.getMarginBox(node).l + domGeom.getMarginBox(node).w;
                        } else {
                            rightMargin += domGeom.getMarginBox(node).w;
                        }
                        var itemInfo = {};
                        itemInfo.node = node;
                        itemInfo.right = rightMargin;
                        this.allTabs.push(itemInfo);
                    }));

                    this.width = this.mxform.domNode.clientWidth; // set initial width
                    this.connect(this.mxform, "resize", this.updateMoreTab);
                }
            },

            updateMoreTab: function () {
                // update tabs to menu or tabs
                var increaceSize = false;
                if (this.width < this.mxform.domNode.clientWidth) {
                    increaceSize = true;
                }
                this.width = this.mxform.domNode.clientWidth;
                if (!increaceSize) {
                    this.moveTabsToMenu();
                }
                if (increaceSize && this.tabsInMenu.length > 0) { // Check if menu items need to return to the tabs
                    this.moveMenuToTab();
                }
                this.updateTabs();
            },

            moveTabsToMenu: function () {
                // move the tabs items into the menu.
                var collection = document.createDocumentFragment(),
                    newMenuItems = [];

                query("li:not(.tabdrop)", this.tabContainer).forEach(lang.hitch(this, function (node) {
                    // find tab items that are dropped into next line.
                    // query selector can not check if item is placed in the more menu
                    if (node.offsetTop > this.dropDownTab.offsetTop && this.tabsInMenu.indexOf(node) === -1) {
                        collection.appendChild(node);
                        newMenuItems.push(node);
                    }
                }));
                if (newMenuItems.length > 0) { // Add new dropdown items
                    domConstruct.place(collection, this.dropDownMenu, "first");
                    this.tabsInMenu = newMenuItems.concat(this.tabsInMenu);
                }
            },

            moveMenuToTab: function () {
                // move Menu items back to the tabs
                var menuIndex = null,
                    tabIndex = null,
                    tab = null,
                    marginDropTabLeft = domGeom.position(this.dropDownTab).x,
                    padding = 10;

                for (menuIndex = 0; menuIndex < this.tabsInMenu.length; menuIndex++) {
                    for (tabIndex = 0; tabIndex < this.allTabs.length; tabIndex++) {
                        tab = this.allTabs[tabIndex];
                        if (tab.node === this.tabsInMenu[menuIndex] && tab.right < (marginDropTabLeft - padding)) {
                            // enough space, add
                            this.tabContainer.appendChild(this.tabsInMenu[menuIndex]);
                            this.tabsInMenu.splice(menuIndex, 1);
                            menuIndex--; // decrement because of removing item.
                        }
                    }
                }
                this.updateTabs();
            },

            updateTabs: function () {
                // update tabs dom
                if (query(".active", this.dropDownMenu).length === 1) { // set tab active when menu item is active
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

            addButton: function (button) {
                // add button to the tabs
                var create = mxui.dom.create,
                    classes = typeof (button.classname) === "undefined" ? "" : button.classname,
                    align = null,
                    xtraButton = null,
                    mxbutton = null;
                if (button.displayAs === "button") {
                    classes = button.buttonStyle === "default" ? classes : classes + " btn-" + button.buttonStyle;
                }
                mxbutton = new mxui.widget._Button({
                    caption: button.caption,
                    iconUrl: button.image,
                    renderType: button.displayAs,
                    class: classes,
                    onClick: lang.hitch(this, this.onclickEvent, button.microflow)
                });

                align = button.align === "right" ? {class: "pull-right"} : {};
                xtraButton = create("li", align, mxbutton.domNode);

                this.tabContainer.appendChild(xtraButton);
            },

            addTab: function (button) {
                // create an extra tab
                var create = mxui.dom.create,
                    caption = typeof (button.caption) === "undefined" ? "" : button.caption,
                    classes = typeof (button.classname) === "undefined" ? "" : button.classname,
                    xtraTab = null,
                    img = null;
                img = typeof (button.caption) === "undefined" ? "" : create("img", {
                    src: button.image
                });
                if (img && button.altText) {
                    img.alt = button.altText;
                }
                xtraTab = create("li", {
                    class: classes
                }, create("a", {
                    href: "#"
                }, img, caption));
                this.handlers.push(on(xtraTab, "click", lang.hitch(this, this.onclickEvent, button.microflow)));

                this.tabContainer.appendChild(xtraTab);
            },

            addButtons: function () {
                // add the buttons next to the tabs
                var buttonIndex = null,
                    button = null;
                for (buttonIndex = 0; buttonIndex < this.tabButtons.length; buttonIndex++) {
                    button = this.tabButtons[buttonIndex];
                    if (button.displayAs === "button" || button.displayAs === "link") {
                        this.addButton(button);
                    } else if (button.displayAs === "tab") {
                        this.addTab(button);
                    }
                }
            },

            onclickEvent: function (mf, evt) {
                // handle the microflow call
                mx.data.action({
                    params: {actionname: mf},
                    callback: function () {
                        logger.debug(".onclickEvent callback");
                    },
                    error: function (error) {
                        logger.error("TabButton onclickEvent: XAS error executing microflow", error);
                    },
                    context: this.mxcontext
                });
                event.stop(evt);
            }
        });
    });

require(["TabExtension/TabButton"]);