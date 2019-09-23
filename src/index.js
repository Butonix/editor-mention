/**
 * Build styles
 */

function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
	    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
	
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
	
    if (callNow) func.apply(context, args);
  };
};

/**
 * Mention Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class Mention {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({ api }) {
    this.api = api;
    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'MARK';

    this.CSS = {
      mentionContainer: 'cdx-mention__container',
      mentionInput: 'cdx-mention__input',
      mention: 'cdx-mention',
      mentionIntro: 'cdx-mention-suggestion__intro',
      mentionAvatar: 'cdx-mention-suggestion__avatar',
      mentionTitle: 'cdx-mention-suggestion__title',
      mentionDesc: 'cdx-mention-suggestion__desc',
      suggestionContainer: 'cdx-mention-suggestion-container',
      suggestion: 'cdx-mention-suggestion',
      inlineToolBar: 'ce-inline-toolbar',
      inlineToolBarOpen: 'ce-inline-toolbar--showed',
      inlineToolbarButtons: 'ce-inline-toolbar__buttons'
    };

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };

    this.mentionContainer = this._make('div', [ this.CSS.mentionContainer ], {});
    this.suggestionContainer = this._make('div', [ this.CSS.suggestionContainer ], {});

    this.mentionInput = this._make('input', [ this.CSS.mentionInput ], {
      innerHTML: '你想 @ 谁?',
      autofocus: true
    });

    this.mentionContainer.appendChild(this.mentionInput);
    this.mentionContainer.appendChild(this.suggestionContainer);

    this.mentionInput.addEventListener('keyup',  debounce(this.handleMentionInput.bind(this), 300));
  }

  /**
   * handle mention input
   *
   * @return {void}
  */
  handleMentionInput(ev) {
    if (ev.code === 'Escape') return this.closeMentionPopover();
    if (ev.code === "Enter") return console.log("select first item")

    console.log('ev: ', ev.code)

    const user = {
      id: 1,
      title: 'mydaerxym',
      desc: 'author of the ..',
      avatar: 'https://avatars0.githubusercontent.com/u/6184465?s=40&v=4'
    };

    const user2 = {
      id: 2,
      title: 'mydaerxym2',
      desc: 'author of the ..',
      avatar: 'https://avatars0.githubusercontent.com/u/6184465?s=40&v=4'
    };

    const suggestion = this.makeSuggestion(user);
    const suggestion2 = this.makeSuggestion(user2);

    this.suggestionContainer.appendChild(suggestion);
    this.suggestionContainer.appendChild(suggestion2);
  }

  /**
   * generate suggestion block
   *
   * @return {HTMLElement}
  */
  makeSuggestion(user) {
    const mention = document.querySelector('#' + this.CSS.mention);
    const suggestionWrapper = this._make('div', [ this.CSS.suggestion ], {});

    const avatar = this._make('img', [ this.CSS.mentionAvatar ], {
      src: user.avatar
    });

    const intro = this._make('div', [ this.CSS.mentionIntro ], {});
    const title = this._make('div', [ this.CSS.mentionTitle ], {
      innerText: user.title
    });
    const desc = this._make('div', [ this.CSS.mentionDesc ], {
      innerText: user.desc
    });

    suggestionWrapper.appendChild(avatar);
    intro.appendChild(title);
    intro.appendChild(desc);
    suggestionWrapper.appendChild(intro);

    suggestionWrapper.addEventListener('click', () => {
      console.log('click user: ', user);
      mention.innerHTML = user.title;
      this.closeMentionPopover();
    });

    // https://avatars0.githubusercontent.com/u/6184465?s=40&v=4

    return suggestionWrapper;
  }

  /**
   * close the mention popover, then focus to mention holder
   *
   * @return {void}
   */
  closeMentionPopover() {
    this.clearSuggestions();
    const mention = document.querySelector('#' + this.CSS.mention);
    const inlineToolBar = document.querySelector('.' + this.CSS.inlineToolBar);

    // empty the mention input
    console.log('this.mentionInput: ', this.mentionInput);
    this.mentionInput.value = '';

    // this.api.toolbar.close is not work
    // so close the toolbar by remove the optn class mannully
    inlineToolBar.classList.remove(this.CSS.inlineToolBarOpen);
    console.log('before focus: ', mention);
    mention.focus();
    this.moveCaret(window, 3);
    // mention holder id should be uniq
    // 在 moveCaret 定位以后才可以删除，否则定位会失败
    setTimeout(() => {
      this.removeAllHolderIds();
    }, 50);
    // move the 'space' next to the mention-holder
    // otherwise the mention will go forever
    // 否则会一直是 mention 的输入
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    console.log('surround 0');

    // if (!range) {
    //   return;
    // }

    // let termWrapper = this.api.selection.findParentTag(this.tag, Mention.CSS);

    // console.log('surround');

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      // this.unwrap(termWrapper);
    } else {
      // this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    console.log('wrap');
    /**
     * Create a wrapper for highlighting
     */
    let markerIn = document.createElement(this.tag);
    let marker = this._make('span', 'child', {});

    marker.appendChild(markerIn);

    // markerIn.classList.add(Mention.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    markerIn.appendChild(range.extractContents());
    range.insertNode(marker);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(marker);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    console.log('unwrap');
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  moveCaret(win, charCount) {
    var sel, range;

    if (win.getSelection) {
      sel = win.getSelection();
      range = document.createRange();

      if (sel.rangeCount > 0) {
        // var textNode = sel.focusNode;
        // debugger;
        // var textNode = sel.anchorNode.parentNode; // sel.focusNode;
        const el = document.querySelector('.ce-paragraph');

        console.log('el.childNodes[0]: ', el.childNodes);
        let index = 0;

        for (let i = 0; i < el.childNodes.length; i++) {
          const node = el.childNodes[i];

          if(node.id === 'cdx-mention') {
            index = i;
          }
        }
        console.log('find index: ', index);

        range.setStart(el.childNodes[index + 2], 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();

        // const count = textNode.childElementCount * 2 + 1;

        // console.log('textNode: ', textNode);
        // console.log('textNode child: ', textNode.childElementCount );
        // console.log('count: ', count);

        // sel.collapse(textNode,  count);
        // sel.collapseToEnd();
      }
    }
  }

  moveCaret2(win, charCount) {
    var sel, range;

    if (win.getSelection) {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        // var textNode = sel.focusNode;
        // debugger;
        // var textNode = sel.anchorNode.parentNode; // sel.focusNode;
        const textNode = document.querySelector('.ce-paragraph');
        const count = textNode.childElementCount * 2 + 1;

        console.log('textNode: ', textNode);
        console.log('textNode child: ', textNode.childElementCount );
        console.log('count: ', count);

        sel.collapse(textNode,  count);
        // sel.collapseToEnd();
      }
    }
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(
      'SPAN',
      this.CSS.mention
    );
    // const termTag = this.api.selection.findParentTag(this.tag);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);

    if (termTag && termTag.id === this.CSS.mention) {
      return this.handleMentionActions();
    }
    return this.handleNormalActions();
  }

  handleNormalActions() {
    console.log('showActions');
    this.mentionContainer.hidden = true;
    let inlineButtons = document.querySelector(
      '.' + this.CSS.inlineToolbarButtons
    );

    inlineButtons.style.display = 'block';
  }

  // clear suggestions list
  clearSuggestions() {
    const node = document.querySelector('.' + this.CSS.suggestionContainer);

    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  // 删除所有 mention-holder 的 id， 因为 closeMentionPopover 无法处理失焦后
  // 自动隐藏的情况
  removeAllHolderIds() {
    const holders = document.querySelectorAll('.' + this.CSS.mention);

    holders.forEach(item => item.removeAttribute('id'));

    return false;
  }

  /**
   * show mention suggestions, hide normal actions like bold, italic etc...inline-toolbar buttons
   * 隐藏正常的 粗体，斜体等等 inline-toolbar 按钮
   *
   */
  handleMentionActions() {
    console.log('handleMentionActions');
    this.mentionContainer.hidden = false;

    this.clearSuggestions();
    // this.removeAllHolderIds();
    this.mentionInput.value = '';

    let inlineButtons = document.querySelector(
      '.' + this.CSS.inlineToolbarButtons
    );

    inlineButtons.style.display = 'none';

    setTimeout(() => {
      this.mentionInput.focus();
    }, 100);
  }

  renderActions() {
    this.mentionInput.placeholder = '你想 @ 谁?';

    return this.mentionContainer;
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="34" height="34" xmlns="http://www.w3.org/2000/svg"><path d="M17.78 19.543l3.085 1.78-.825 1.499-1.04-.033-1.03 1.784h-2.075l1.575-2.73-.537-.82.848-1.48zm.578-1.007l3.83-6.687a1.688 1.688 0 0 1 2.303-.626l.003.002a1.725 1.725 0 0 1 .65 2.327l-3.719 6.755-3.067-1.771zm-8.17 3.665h3.662a1.187 1.187 0 0 1 0 2.374h-3.663a1.187 1.187 0 1 1 0-2.374z"/></svg>';
  }

  /**
   * Sanitizer rule
   * @return {{mark: {class: string}}}
   */
  static get sanitize() {
    return {
      mark: {
        class: Mention.CSS
      }
    };
  }

  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}