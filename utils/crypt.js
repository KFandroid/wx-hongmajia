
export const stringToByteArray = function (str) {
  var output = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    while (c > 0xff) {
      output[p++] = c & 0xff;
      c >>= 8;
    }
    output[p++] = c;
  }
  return output;
};


/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param {Array} array Array of numbers representing characters.
 * @return {string} Stringification of the array.
 */
export const byteArrayToString = function (array) {
  var output = [];
  for (var i = 0; i < array.length; i++) {
    output[i] = String.fromCharCode(array[i]);
  }
  return output.join('');
};


/**
 * Converts a JS string to a UTF-8 "byte" array.
 * @param {string} str 16-bit unicode string.
 * @return {Array.<number>} UTF-8 byte array.
 */
export const stringToUtf8ByteArray = function (str) {
  // TODO: Use native implementations if/when available
  str = str.replace(/\r\n/g, '\n');
  var out = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = (c >> 6) | 192;
      out[p++] = (c & 63) | 128;
    } else {
      out[p++] = (c >> 12) | 224;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    }
  }
  return out;
};


/**
 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
 * @param {Array.<number>} bytes UTF-8 byte array.
 * @return {string} 16-bit Unicode string.
 */
export const utf8ByteArrayToString = function (bytes) {
  // TODO: Use native implementations if/when available
  var out = [], pos = 0, c = 0;
  while (pos < bytes.length) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      var c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      out[c++] = String.fromCharCode(
        (c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join('');
};