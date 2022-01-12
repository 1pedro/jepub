/**
 * Generates a UUID
 * @see https://stackoverflow.com/a/2117523
 * @returns {string} uuid
 */
export declare function uuidv4(): string;
/**
 * Checks if a value is object
 * @see https://stackoverflow.com/a/14706877
 * @returns {boolean}
 */
export declare function isObject(obj: any): boolean;
/**
 * Checks if a value is empty
 * @returns {boolean}
 */
export declare function isEmpty(val: string | null | undefined): boolean;
/**
 * Get current moment in ISO format
 * @param {Object} date
 * @returns {string} ISO date
 */
export declare function getISODate(date?: Date): string;
/**
 * Convert HTML to valid XHTML
 * @param {String} html
 * @param {String} outText return as plain text
 */
export declare function parseDOM(html: string, outText?: boolean): string;
/**
 * Convert HTML to plain text
 * @param {String} html
 * @param noBr
 */
export declare function html2text(html: string, noBr?: boolean): string;
/**
 * @see https://gist.github.com/dperini/729294
 * @param {String} value
 */
export declare function validateUrl(value: string): boolean;
/**
 * Convert MIME type to extension
 * @param {String} mime
 */
export declare function mime2ext(mime: string): string | null;
