import { ForestConfig } from './interface/forest_config.js'
import ForestConfigInternal from './internal/interface/forest_config.js'
import doRequest from './internal/repo/request_gen.js'

export class Forest {
    private _config: ForestConfigInternal
    private _token: string
    private _host: string
    constructor(token: string, host = 'localhost:8200', config?: ForestConfig) {
        if (!this.token) throw new Error('empty vault token string')
        this._token = token
        this._host = host
        if (!config) {
            this._config = {
                kvEngine: 'kv',
                timeout: 15000,
                secure: true,
            }
        } else {
            this._config = {
                kvEngine: config.kvEngine || 'kv',
                timeout: config.timeout || 15000,
                secure: config.ssl || true,
            }
        }
    }

    async getKeyValue<T = any>(key: string): Promise<T> {
        const { timeout, kvEngine, secure } = this.config
        const response = await doRequest<T>(
            this.token,
            this.host,
            `/v1/${kvEngine}/${key}`,
            'GET',
            undefined,
            timeout,
            secure
        )
        return response.data
    }

    get config() {
        return this._config
    }

    get token() {
        return this._token
    }

    get host() {
        return this._host
    }
}
