// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Initialize the CodeMirror editor
    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexedDB.
    // Fall back to localStorage if nothing is stored in indexedDB, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      // If data is found in IndexedDB, use it. Otherwise, use localStorage or the header fallback.
      this.editor.setValue(data.length > 0 ? data[0].content : localData || header);
    }).catch(err => {
      console.error('Error loading data from IndexedDB:', err);
      // Fallback to localStorage or header if IndexedDB fails
      this.editor.setValue(localData || header);
    });

    // Save the content of the editor to localStorage on every change
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor to IndexedDB when the editor loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content')).catch(err => {
        console.error('Error saving to IndexedDB:', err);
      });
    });
  }
}
