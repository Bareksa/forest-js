import { ForestConfig } from './interface/forest_config'
import ForestConfigInternal from './internal/interface/forest_config'
import { VaultSuccessResponse } from './internal/interface/vault_response.js'
import doRequest from './internal/repo/request_gen'

export class Forest {
    private _config: ForestConfigInternal
    private _token: string
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
