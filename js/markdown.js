import { Marked } from './lib/marked.esm.js';

const marked = new Marked();

export function parseMarkdown(text) {
    return marked.parse(text);
}
