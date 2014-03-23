mxui.widget.declare('TabName.TabButton', {
    mixins: [mendix.addon._Contextable],
    inputargs: {
        tabButtons: []
    },
    handlers: [],
    context: null,
    
    postCreate: function () {
        this.addTabButton();
        this.addButtons();
        this.initContext();
        this.actLoaded();
    },
    
    applyContext: function (context, callback) {
        // store context for miroflow calls
        this.context = context;        
        callback && callback();
    },
    
    addTabButton: function () {
        // add fake tabs that behave like buttons
        var tabContainer = dojo.query(".mx-tabcontainer-tabs")[0]; // TODO  more accurate tab selection
        if (tabContainer) {
            var $ = mxui.dom.create;
            for (var i = 0; i < this.tabButtons.length; i++) {
                var b = this.tabButtons[i];
                if (b.displayAs === "tab") {
                    var img = typeof (b.caption) === "undefined"  ?'' : $('img', {src: b.image});;
                    if(img && b.altText)
                        img.alt = b.altText;
                    var caption = typeof (b.caption) === "undefined"  ? '' : b.caption;
                    var classes = typeof (b.classname) === "undefined" ? '' : b.classname;                    
                    var xtraTab = $('li', {class: classes}, $('a', {
                        href: '#'
                    }, img, caption));
                    this.handlers.push(dojo.on(xtraTab, "click", dojo.hitch(this, this.onclickEvent, b.microflow)));

                    tabContainer.appendChild(xtraTab);
                }
            }
        }
    },

    addButtons: function () {
        // add the buttons next to the tabs
        var tabContainer = dojo.query(".mx-tabcontainer-tabs")[0];
        if (tabContainer) {
            var $ = mxui.dom.create;
            for (var i = 0; i < this.tabButtons.length; i++) {
                var b = this.tabButtons[i];            
                if (b.displayAs === "button" || b.displayAs === "link") {
                    var classes = typeof (b.classname) === "undefined" ? "" : b.classname;
                    if(b.displayAs === "button")
                        classes = b.buttonStyle === 'default' ? classes : classes + " btn-"+b.buttonStyle;
                            
                    var mxbutton = new mxui.widget._Button({
                        caption: b.caption,
                        iconUrl: b.image,                       
                        renderType: b.displayAs,
                        class: classes
                    });
                    this.handlers.push(dojo.on(mxbutton, "click", dojo.hitch(this, this.onclickEvent, b.microflow)));
                    
                    var align = b.align === "right" ? {class: 'pull-right'} : {};
                    var xtraButton = $('li', align, mxbutton.domNode);

                    tabContainer.appendChild(xtraButton);
                }
            }
        }
    },

    onclickEvent: function (mf, e ) {
        // hande the micro flow call
        mx.xas.action({
            error: function () {
                logger.error("TabButton onclickEvent: XAS error executing microflow");
            },
            actionname: mf,
            context: this.context , 
            callback: function () {}
        });
        e.stopPropagation();
        e.preventDefault();                    
    }
});