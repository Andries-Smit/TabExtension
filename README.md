#Description
Extends the Mendix tab with some nice features.
- Set the name of the tab based on a attribute value
- Add buttons next to the tabs. (rendered as Button, link or Tab)
- Style the tabs to display vertically next to the container
- Mover abundant tab to a drop down menu. 

### Typical usage scenario
- The names of the tabs can be changed based on the value of an entity attribute. The names are updated when the field is changed or the object updated in a microflow.
- Additional Buttons can be added next to the original tabs. The buttons can be rendered as a Tab, Button or a Link.
- A 'more button' can be shown when there are too many tabs to fit in one single row. The abundant tabs are moved inside a drop down menu. When resizing the window, the tabs are moved back and forward between the tabs and the drop down menu.
- Do you want to display the tabs not above the tab container? You can also move them the of left to it!

#Installation
- The tab name widget should be place in the context of the tab.
- The Tab button widget should be place below the tab.

#Properties
Tab Name:
- Context Entity (The Entity of the attribute and equal to the context
- Attribute (The attribute that will set the name of the Tab Title.)
- Empty Value ( Value to be shown when attribute value is empty )

Tab Button: (Per button you can set the following properties):
- Caption (caption on the button)
- Image (image shown in button)
- Alt text (Alt text for the image, allows you to only show a image without caption with a alt as hint)
- CSS class (CSS class for the button)
- Display as (Render button as: Link, Button or Tab)
- Button style (style of button, no for links or tabs: Bootstrap button styles)
- Align ( Align the buttons or links right or default. Tab button will be rendered left)
- Microflow (Microflow that called on click)

More:
- More Tab (Responsive moving second row of tabs in a drop down button.)
- More Caption (Caption of the drop down button.)

Vertical tabs:
- no configuration needed, use CSS class: 'tabs-left' or 'tabs-right' with optional class 'sideways' to rotate the label of the tab.
Note that the Cascading Styling Sheet for vertical tabs is added by the 'Tab Button' widget. If you like to use this styling; include the widget at least one in a 'Page' and apply the classes to the Tabs. The widget does not need to be included in the same page. If you are not using the widget at all, you can also choose to copy the styling from the widget into your own style sheets.

#Questions?
If there are any questions; Feel free to ask at the Mendix Forum:
https://mxforum.mendix.com/questions/6085/App-Store-Widget-Tab-Extension-Dynamic-Names-Buttons

Please report issue via the GidHub issue tracker
https://github.com/Andries-Smit/TabExtension/issues
