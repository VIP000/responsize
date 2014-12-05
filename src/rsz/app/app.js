goog.provide('rsz.App');

goog.require('rsz.Toolbar');
goog.require('rsz.Stage');
goog.require('rsz.Wysiwyg');
goog.require('rsz.Responsizer');
goog.require('rsz.FileService');


/**
 * @class
 * this is the entry point of Responsize web app
 * an instance of this class is created in src/index.js at start
 */
class App {
  /**
   * @constructor
   * @param {Element} element
   */
  constructor(element) {

    /**
     * @type {Toolbar}
     */
    this.toolbar= new Toolbar(element.querySelector('#toolbar'));


    /**
     * @type {Stage}
     */
    this.stage = new Stage(element.querySelector('#stage'));


    /**
     * @type {Wysiwyg}
     */
    this.wysiwyg = new Wysiwyg(element.querySelector('#stage'));


    /**
     * @type {Responsizer}
     */
    this.responsizer = new Responsizer();


    /**
     * @type {FileService}
     */
    this.fileService= new FileService();


    // bind components together
    this.toolbar.onSize = (w, h) => this.stage.setSize(w, h);
    this.toolbar.onOpenFile = () => this.fileService.open().then((blob) => this.onOpen(blob));
    this.toolbar.onMoveDown = () => this.wysiwyg.moveDown();
    this.toolbar.onMoveUp = () => this.wysiwyg.moveUp();
    this.wysiwyg.onBeforeSelect = (element) => {return this.hasSiblings(element)};
    this.wysiwyg.onSelect = () => this.toolbar.setSelection(this.wysiwyg.getSelected());

    // init
    this.toolbar.setDevice(Device.desktop);
  }


  /**
   * counts the number of siblings of type Element
   * @return {boolean} true if the element has siblings
   * @export
   */
  hasSiblings(element) {
    let numChildren = 0;
    for(let idx in element.parentNode.childNodes) {
      let el = element.parentNode.childNodes[idx];
      if(el.nodeType === 1) {
        numChildren++;
      }
    }
    return numChildren > 1;
  }


  /**
   * a file has been chosen by the user in cloud explorer
   * @param {Object} blob
   */
  onOpen(blob) {
    this.stage.setUrl(blob.url).then((doc) => {
      this.wysiwyg.init(doc);
      this.wysiwyg.setSelectionMode(true);
      this.responsizer.init(doc);
      this.toolbar.init(doc);
    });
  }
}
