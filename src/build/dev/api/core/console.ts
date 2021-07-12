namespace console {
	export function genTSDocFor(data: any, name: string) {
		Logger.Log(`\n${Dumper.toDTS(data, name)}`, 'DOCUMENTATION')
	}
	export function debug(message: any, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'DEBUG')
	}
	export function json(message: any, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${JSON.stringify(message)}`, 'JSON' + (prefix ? "-" + prefix : ""))
	}
	export function error(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'ERROR')
	}
	export function exception(exception: java.lang.Throwable) {
		Logger.LogError(exception)
	}
	export function info(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'INFO')
	}
	export function log(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'LOG')
	}
	export function warn(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'WARN')
	}
}