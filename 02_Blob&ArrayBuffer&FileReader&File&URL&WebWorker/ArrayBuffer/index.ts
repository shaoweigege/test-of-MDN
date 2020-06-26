/**
 * 将ArrayBuffer对象、TypedArray对象转换为字符串
 * @param input
 * @param outputEncoding 编码方式
 * @return {String}
 */
function ab2str(
    input: ArrayBuffer | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array,
    outputEncoding: string = 'utf8',
): string {
  const decoder = new TextDecoder(outputEncoding)
  return decoder.decode(input)
}

/**
 * 将字符串转换为ArrayBuffer对象
 * @param input
 * @return {ArrayBuffer}
 */
function str2ab(input: string): ArrayBuffer {
  //将字符串转换为Uint8Array
  const uInt8Array = new TextEncoder().encode(input)
  //从Uint8Array对象得到ArrayBuffer实例
  return uInt8Array.buffer
}