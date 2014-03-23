define("TabName/TabName", ["dojo", "dijit", "dojox", "dojo/require!mxui/widget/_FormWidget"], function (_1, _2, _3) {
    _1.provide("TabName.TabName");
    _1.require("mxui.widget._FormWidget");
    dojo.require("dojo.NodeList-traverse");
    _1.declare("TabName.TabName", mxui.widget._FormWidget, {
        entity: "",
        attribute: "",
        emptyValue: "",

        postMixInProperties: function () {
            // Combine the properties so the FromWidget can handle the rest.
            // Name based Mendix widgets did not update anymore like it did in mx4
            this.attributePath = this.entity+"/"+this.attribute;
            this.inherited(arguments);
        },
        
        buildRendering: function () {
            // No real function but the _FormWideget needs this node.
            this.readNode = mxui.dom.create("div");
            this.inherited(arguments);
        },
        
        _setValueAttr: function (value) {
            // on value set or change this function wil update the value of the tab label
            var content = dojo.query(this.domNode).closest(".mx-tabcontainer-pane")[0];
            dojo.attr(content, "title", value);
            var tabIndex = parseInt(dojo.attr(content, "widgetid").split("_").pop(), 10);
            var tabWidget = dojo.query(content).closest(".mx-tabcontainer")[0];
            var tabList = dojo.query(".mx-tabcontainer-tabs li a", tabWidget);
            var tab = tabList[tabIndex];
            if(value){
                tab.innerHTML = value;  
            } else {
                tab.innerHTML = this.emptyValue;  
            }
        }
    });
});;