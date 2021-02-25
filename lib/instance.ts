import { ForestConfig } from './interface/forest_config'
import ForestConfigInternal from './internal/interface/forest_config'
import { VaultSuccessResponse } from './internal/interface/vault_response.js'
import doRequest from './internal/repo/request_gen'

export class Forest {
    private _config: ForestConfigInternal
    private _token: string
    private kv: any
    constructor(
        token: string,
        host = 'http://localhost:8200',
        config?: ForestConfig
    ) {
        if (!token) throw new Error('empty vault token string')
        this._token = token.trim()

        const parser = host.trim().split('://')
        let [protocol, hostname] = parser
        let secure: boolean
        switch (protocol) {
            case 'http':
                secure = false
                break
            case 'https':
                secure = true
                break
            default:
                // Protocol is not http or https, but THERE IS protocol given
                if (parser.length > 1) {
                    throw new Error(`protocol '${protocol}' is not supported`)
                } else {
                    // there's no protocol given so the whole thing is hostname
                    hostname = parser[0]
                }
                secure = false
                break
        }
        let port: number
        let _p = hostname.split(':')[1]
        if (_p) {
            const stringPort = _p.split('/')[0]
            port = Number(stringPort)
            if (isNaN(port)) {
                throw new Error(
                    `cannot parse into number for port from value: '${stringPort}'`
                )
            }
        } else {
            port = 8200
        }
        let _host = hostname.split(':')[0].split('/')[0]
        if (!config) {
            this._config = {
                kvEngine: 'kv',
                timeout: 15000,
                secure,
                port,
                host: _host,
            }
        } else {
            this._config = {
                kvEngine: config.kvEngine || 'kv',
                timeout: config.timeout || 15000,
                port,
                host: _host,
                secure,
            }
        }
    }

    /**
     * Fetch key value from vault
     */
    async getKeyValue<T = any>(key: string): Promise<T> {
        const { timeout, kvEngine, secure } = this.config
        const response = await doRequest(
            this.token,
            this.host,
            this.port,
            `/v1/${kvEngine}/${key}`,
            'GET',
            undefined,
            timeout,
            secure
        )
        const parsedResponse: VaultSuccessResponse<T> = JSON.parse(response)
        return parsedResponse.data
    }

    /**
     * Fetch key value from vault, stores the object in memory, and primes it for getString, getNumber, etc methods
     */
    async manageKeyValue(key: string) {
        const { timeout, kvEngine, secure } = this.config
        const response = await doRequest(
            this.token,
            this.host,
            this.port,
            `/v1/${kvEngine}/${key}`,
            'GET',
            undefined,
            timeout,
            secure
        )
        const parsedResponse: VaultSuccessResponse<any> = JSON.parse(response)
        this.kv = parsedResponse.data
    }

    /** @internal */
    private drillDown(state: any, path: string[]): any {
        const [target, ...next] = path
        if (!target) {
            return undefined
        }
        if (state[target]) {
            if (next.length) {
                return this.drillDown(state[target], next)
            }
            return state[target]
        } else {
            return undefined
        }
    }

    /**
     * get value from the key on stored object.
     * Result value is considered string.
     * No cast is done.
     * Returns empty string if no value is found.
     */
    getString(key: string): string {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return ''
        }
        return value as string
    }

    /**
     * get value from the key on stored object and attempt
     * to parse it.
     * Returns empty string if no value is found.
     */
    parseString(key: string): string {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return ''
        }
        if (typeof value === 'string') {
            return value
        } else {
            return JSON.stringify(value)
        }
    }

    /**
     * get value from the key on stored object.
     * Result value is considered number.
     * No cast is done.
     * Returns 0 if no value is found.
     */
    getNumber(key: string): number {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return 0
        }
        return value as number
    }

    /**
     * get value from the key on stored object and attempt
     * to parse it.
     * Returns 0 if no value is found or cannot be parsed.
     */
    parseNumber(key: string): number {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return 0
        }
        const num = Number(value)
        if (isNaN(num)) {
            return 0
        }
        return num
    }

    /**
     * get value from the key on stored object.
     * Result value is considered string array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    getStringArray(key: string): string[] {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return []
        }
        return value as string[]
    }

    /**
     * get value from the key on stored object.
     * Result value is considered array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    getArray(key: string): any[] {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return []
        }
        return value as any[]
    }

    /**
     * get value from the key on stored object.
     * Result value is considered number array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    getNumberArray(key: string): number[] {
        const path = key.split('.')
        const value = this.drillDown(this.kv, path)
        if (value === void 0) {
            return []
        }
        return value as number[]
    }

    /**
     * get value from the key on stored object.
     * Result value is considered the given class.
     * No cast is done.
     * Returned value ***is undefined*** if no value is found.
     * getAsClass ***does not create instance***. It just maps the value for typing support
     */
    getAsClass<T>(_class: T): T {
        return this.kv as T
    }

    get config() {
        return this._config
    }

    get token() {
        return this._token
    }

    get host() {
        return this._config.host
    }

    get port() {
        return this._config.port
    }
}
