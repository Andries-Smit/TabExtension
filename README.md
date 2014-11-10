#Description
Extends the Mendix tab with some nice features.
- Set the name of the tab based on a attribute value
- Add buttons next to the tabs. (rendered as Button, link or Tab)

### Typical usage scenario
- Change the name of tabs based on a attribute value
- Add buttons next to the tabs
- Add a button next to the tab that look like a tab

#Installation
- The tab name widget should be place in the context of the tab.
- The Tab button widget should be place below the tab.

#Properties
Tab Name:
- Context Entity (The Entity of the attribute and equal to the context
- Attribute (The attribute that will set the name of the Tab Title.)
- Empty Value ( Value to be shown when attribute value is empty )

Tab Button (Per button you can set the following properties):
- Caption (caption on the button)
- Image (image shown in button)
- Alt Text (Alt text for the image, allows you to only show a image without caption with a alt as hint)
- CSS Class (CSS class for the button)
- Display As (Render button as: Link, Button or Tab)
- Button Style (style of button, no for links or tabs: Bootstrap button styles)
- Align ( Align the buttons or links right or default. Tab button will be rendered left)
- Microflow (Microflow that called on click)

#Questions?
If there are any issues or questions; Feel free to ask at the Mendix Forum:
https://mxforum.mendix.com/questions/6085/App-Store-Widget-Tab-Extension-Dynamic-Names-Buttons
