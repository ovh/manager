import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { expect, vi } from 'vitest';
import prettyFormat from "pretty-format";

import '@ovh-ux/manager-static-analysis-kit/tests/html-a11y-tests-setup';
import '@ovh-ux/manager-static-analysis-kit/tests/html-w3c-tests-setup';

import ActionMenuTransFR from './src/components/action-menu/translations/Messages_fr_FR.json';
import DatagridTransFR from './src/components/datagrid/translations/Messages_fr_FR.json';
import FiltersTransFR from './src/components/filters/translations/Messages_fr_FR.json';

void i18n.use(initReactI18next).init({
  fallbackLng: 'fr_FR',
  interpolation: { escapeValue: false },
  resources: {
    fr: {
      'action-menu': ActionMenuTransFR,
      datagrid: DatagridTransFR,
      filterAdd: FiltersTransFR,
    },
  },
});

global.EventTarget = class EventTargetPolyfill {
  private listeners: Record<string, Set<(event: Event) => void>> = {};

  addEventListener(type: string, listener: (event: Event) => void): void {
    (this.listeners[type] ||= new Set()).add(listener);
  }

  removeEventListener(type: string, listener: (event: Event) => void): void {
    this.listeners[type]?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    const handlers = this.listeners[event.type];
    if (handlers) {
      handlers.forEach((listener) => listener(event));
    }
    return !event.defaultPrevented;
  }
};

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

const ResizeObserverMock = vi.fn((callback: ResizeObserverCallback): ResizeObserver => {
  const mockEntry: ResizeObserverEntry = {
    target: document.createElement('div'),
    contentRect: {
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    },
    borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
    contentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
    devicePixelContentBoxSize: [{ inlineSize: 100, blockSize: 100 }],
  };

  // Call immediately, simulating a resize notification
  callback([mockEntry], {} as ResizeObserver);

  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  } as unknown as ResizeObserver;
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1000,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 1000,
  x: 0,
  y: 0,
  toJSON: () => {},
})) as unknown as () => DOMRect;

HTMLElement.prototype.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();

Object.defineProperty(Element.prototype, 'scrollLeft', {
  configurable: true,
  writable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollTop', {
  configurable: true,
  writable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollWidth', {
  configurable: true,
  value: 0,
});

Object.defineProperty(Element.prototype, 'scrollHeight', {
  configurable: true,
  value: 0,
});

const originalConsoleError = console.error.bind(console);

console.error = (...args: unknown[]): void => {
  const errorMessage = args[0]?.toString?.() ?? '';
  if (
    errorMessage.includes("reading 'left'") ||
    errorMessage.includes('[@zag-js/dismissable]') ||
    errorMessage.includes('preventScroll') ||
    errorMessage.includes('Uncaught Exception')
  ) {
    return; // suppress noisy jsdom/Zag async cleanup errors
  }
  originalConsoleError(...args);
};

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    const errorMessage = event.message || event.error?.message || '';
    if (errorMessage.includes("reading 'left'") || errorMessage.includes('[@zag-js/dismissable]')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const errorMessage = event.reason?.message || '';
    if (errorMessage.includes("reading 'left'") || errorMessage.includes('[@zag-js/dismissable]')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

/**
 * Formats HTML string with proper indentation for readable snapshots
 * Each attribute is placed on its own line for better readability
 * Synchronous formatter since snapshot serializers must be synchronous
 */
function formatHtml(html: string): string {
  // First pass: parse HTML and extract tags with attributes
  const lines: string[] = [];
  let i = 0;
  const len = html.length;
  let indent = 0;
  const indentSize = 2;
  let inQuotes = false;
  let quoteChar = '';
  let currentTag = '';
  let tagStart = -1;
  let inTag = false;

  while (i < len) {
    const char = html[i];
    const prevChar = i > 0 ? html[i - 1] : '';
    const nextChar = i < len - 1 ? html[i + 1] : '';

    // Handle quotes
    if ((char === '"' || char === "'") && inTag) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
        currentTag += char;
      } else if (char === quoteChar && prevChar !== '\\') {
        inQuotes = false;
        quoteChar = '';
        currentTag += char;
      } else {
        currentTag += char;
      }
      i++;
      continue;
    }

    // Handle tag opening
    if (char === '<' && !inQuotes) {
      if (nextChar === '/') {
        // Closing tag
        indent = Math.max(0, indent - 1);
        lines.push(' '.repeat(indent * indentSize) + '</');
        i += 2;
        inTag = true;
        currentTag = '/';
        continue;
      }
      // Opening tag
      if (i > 0) {
        lines.push('');
      }
      lines.push(' '.repeat(indent * indentSize) + '<');
      inTag = true;
      currentTag = '';
      tagStart = i;
    } else if (char === '>' && !inQuotes && inTag) {
      currentTag += char;
      // Process the tag we collected
      const tagContent = currentTag.slice(0, -1); // Remove the '>'
      
      // Check if it's a self-closing tag
      const voidElements = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;
      const isSelfClosing = tagContent.trim().endsWith('/');
      const tagMatch = tagContent.trim().replace(/^\/+/, '').match(/^(\w+)/);
      const tagName = tagMatch ? tagMatch[1] : '';
      const isVoid = tagName ? voidElements.test(tagName) : false;

      // Extract tag name and attributes
      const parts = tagContent.trim().replace(/^\/+/, '').split(/\s+/);
      const name = parts[0] || '';
      const attributes = parts.slice(1).join(' ');

      if (name) {
        lines[lines.length - 1] += name;
      }

      // Format attributes on separate lines
      if (attributes.trim()) {
        // Parse attributes: name="value" or name='value'
        const attrRegex = /(\S+)=(["'])((?:\\.|(?!\2).)*)\2/g;
        let attrMatch;
        const attrs: Array<{ name: string; value: string }> = [];
        
        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
          const attrName = attrMatch[1] || '';
          const attrValue = attrMatch[3] || '';
          if (attrName) {
            attrs.push({ name: attrName, value: attrValue });
          }
        }

        // Add each attribute on its own line
        for (const attr of attrs) {
          lines.push(' '.repeat((indent + 1) * indentSize) + attr.name + '="' + attr.value + '"');
        }
      }

      // Add closing bracket
      lines.push(' '.repeat(indent * indentSize) + '>');

      if (!isSelfClosing && !isVoid) {
        indent++;
      }

      inTag = false;
      currentTag = '';
    } else if (inTag) {
      currentTag += char;
    } else {
      // Text content
      if (char !== '\n' && char !== '\r') {
        if (lines.length === 0 || (lines[lines.length - 1] && lines[lines.length - 1] === '')) {
          lines.push(' '.repeat(indent * indentSize) + char);
        } else {
          const lastLine = lines[lines.length - 1];
          if (lastLine !== undefined) {
            lines[lines.length - 1] = lastLine + char;
          }
        }
      }
    }
    i++;
  }

  // Clean up and normalize
  return lines
    .map((line) => line.trimEnd())
    .filter((line, index, arr) => {
      // Remove excessive blank lines
      if (!line.trim() && index > 0 && index < arr.length - 1 && !arr[index - 1]?.trim()) {
        return false;
      }
      return true;
    })
    .join('\n')
    .trim();
}

// Custom snapshot serializer to normalize class names
// This prevents snapshot failures when class names change order or are generated dynamically
expect.addSnapshotSerializer({
  test: (val: unknown): boolean => {
    // Check if it's a string (HTML)
    if (typeof val === 'string') {
      return true;
    }
    // Check if it's an HTMLElement or Element
    if (
      val &&
      typeof val === 'object' &&
      (val instanceof HTMLElement ||
        val instanceof Element ||
        ('outerHTML' in val && typeof (val as { outerHTML: unknown }).outerHTML === 'string') ||
        ('innerHTML' in val && typeof (val as { innerHTML: unknown }).innerHTML === 'string'))
    ) {
      return true;
    }
    return false;
  },
  print: (val: unknown): string => {
    let htmlString = '';

    // Handle HTMLElement or Element objects directly (container, baseElement, etc.)
    if (val instanceof HTMLElement || val instanceof Element) {
      htmlString = val.outerHTML || val.innerHTML || '';
    }
    // Handle objects with outerHTML property
    else if (val && typeof val === 'object' && 'outerHTML' in val) {
      htmlString = String((val as { outerHTML: string }).outerHTML);
    }
    // Handle objects with innerHTML property
    else if (val && typeof val === 'object' && 'innerHTML' in val) {
      htmlString = String((val as { innerHTML: string }).innerHTML);
    }
    // Handle string directly
    else if (typeof val === 'string') {
      htmlString = val;
    } else {
      return String(val);
    }

    // Normalize class attributes by:
    // 1. Normalizing CSS module class names (replacing hash with placeholder)
    // 2. Sorting classes alphabetically
    const normalizedHtml = htmlString.replace(
      /(class|className)=["']([^"']+)["']/gi,
      (_match, attr, classes) => {
        // Split classes, normalize CSS module hashes, sort, and rejoin
        const normalizedClasses = classes
          .split(/\s+/)
          .map((c: string) => {
            const trimmed = c.trim();
            if (!trimmed) return '';
            
            // Normalize CSS module class names: _baseName_hash_moduleId -> _baseName_HASH_moduleId
            // Pattern: _className_abc123_1 (base can contain hyphens, underscores, double hyphens)
            // Examples: _form-field_112eg_2 -> _form-field_HASH_2
            //           _text--label_1aw48_49 -> _text--label_HASH_49
            // The pattern is: _baseName_hash_moduleId where hash is alphanumeric
            return trimmed.replace(/^(_[a-zA-Z0-9_-]+)_([a-zA-Z0-9]+)_(\d+)$/, '$1_HASH_$3');
          })
          .filter((c: string) => c.length > 0)
          .sort()
          .join(' ');
        return `${attr}="${normalizedClasses}"`;
      },
    );

    // Format HTML with proper indentation for readability
    // Note: prettier.format() is async in this setup, but snapshot serializers must be synchronous
    // So we use a custom synchronous formatter instead
    return formatHtml(normalizedHtml);
  },
});
