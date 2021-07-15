namespace console {
	function buildPrefix(prefix?: string) {
		return prefix ? "[" + prefix + "] " : ""
	}
	function buildMessage(message: any, prefix?: string) {
		return buildPrefix(prefix) + message
	}
	export function genTSDocFor(data: any, name: string) {
		Logger.Log(`\n${Dumper.toDTS(data, name)}`, 'DOCUMENTATION')
	}
	export function debug(message: any, prefix?: string) {
		Logger.Log(`${message}`, 'DEBUG')
	}
	export function json(message: any, prefix?: string) {
		Logger.Log(buildMessage(JSON.stringify(message), prefix), 'JSON' + (prefix ? "-" + prefix : ""))
	}
	export function error(message: string | number, prefix?: string) {
		Logger.Log(buildMessage(message, prefix), 'ERROR')
	}
	export function exception(exception: java.lang.Throwable) {
		Logger.LogError(exception)
	}
	export function info(message: string | number, prefix?: string) {
		Logger.Log(buildMessage(message, prefix), 'INFO')
	}
	export function log(message: string | number, prefix?: string) {
		Logger.Log(buildMessage(message, prefix), 'LOG')
	}
	export function warn(message: string | number, prefix?: string) {
		Logger.Log(buildMessage(message, prefix), 'WARN')
	}
}