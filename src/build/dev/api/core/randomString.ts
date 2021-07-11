/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 * 
 * @param {Integer} len Desired length
 * @param {String} an Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
function randomString(len: number, an?: string): string {
	an = an && an.toLowerCase()
	var str = "",
		i = 0,
		min = an == "a" ? 10 : 0,
		max = an == "n" ? 10 : 62
	for (; i++ < len;) {
		var r = Math.random() * (max - min) + min << 0
		str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48)
	}
	return str
}
/**
 * Example
 * console.log(randomString(10))      // i.e: "4Z8iNQag9v"
 * console.log(randomString(10, "a")) // i.e: "aUkZuHNcWw"
 * console.log(randomString(10, "n")) // i.e: "9055739230"
 */