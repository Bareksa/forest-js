import { ForestConfig } from './interface/forest_config'
import ForestConfigInternal from './internal/interface/forest_config'
import { VaultSuccessResponse } from './internal/interface/vault_response.js'
import doRequest from './internal/repo/request_gen'

export class Forest {
    private _config: ForestConfigInternal
    private _token: string
    constructor(token: string, config?: ForestConfig) {
        if (!token) throw new Error('empty vault token string')
        this._token = token
        if (!config) {
            this._config = {
                kvEngine: 'kv',
                timeout: 15000,
                secure: false,
                port: 8200,
                host: 'localhost',
            }
        } else {
            this._config = {
                kvEngine: config.kvEngine || 'kv',
                timeout: config.timeout || 15000,
                secure: config.ssl || false,
                port: config.port || 8200,
                host: config.host || 'localhost',
            }
        }
    }

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
