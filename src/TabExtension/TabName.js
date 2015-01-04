define("TabExtension/TabName", ["dojo", "mxui/widget/_FormWidget", "dojo/NodeList-traverse"], function(dojo, _FormWidget) {

    return dojo.declare("TabExtension.TabName", _FormWidget, {
        entity: "",
        attribute: "",
        emptyValue: "",

        postMixInProperties: function() {
            // Combine the properties so the FromWidget can handle the rest.
            // Name based Mendix widgets did not update anymore like it did in mx4
            this.attributePath = this.entity + "/" + this.attribute;
            this.inherited(arguments);
        },

        buildRendering: function() {
            // No real function but the _FormWideget needs this node.
            this.readNode = mxui.dom.create("div");
            this.inherited(arguments);
        },

        _setValueAttr: function(value) {
            // on value set or change this function wil update the value of the tab label
            var content = dojo.query(this.domNode).closest(".mx-tabcontainer-pane")[0];
            if (content) { //check if still alive
                dojo.attr(content, "title", value);
                // find the Tab widget, in which the name widget is placed
                var tabWidget = dojo.query(content).closest(".mx-tabcontainer")[0];
                // find the pane the widget is place
                var pane = dojo.query(content).closest(".mx-tabcontainer-pane")[0];
                // find all panes in this Tab widget
                var allPanes = dojo.query(".mx-tabcontainer-pane", tabWidget);

                var tabIndex = allPanes.indexOf(pane);
                // will throw exeption on load, function called twice for unknown reason, second time it works
                var tabList = dojo.query(".mx-tabcontainer-tabs li a", tabWidget);
                var tab = tabList[tabIndex];
                if (tab) {
                    if (value) {
                        tab.innerHTML = value;
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