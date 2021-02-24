import http, { ClientRequest, IncomingMessage, RequestOptions } from 'http'
import https from 'https'
import { VaultErrorResponse } from '../interface/vault_response'

interface Body {
    [key: string]: any
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'LIST'

/**
 * The body is any json compatible requests.
 * Returns empty string if status code is 204
 */
export default function doRequest(
    token: string,
    host: string,
    port: number,
    path: string,
    method: Method,
    body?: Body | Body[],
    timeout = 15000,
    secure = false
): Promise<string> {
    return new Promise((resolve, reject) => {
        const responseHandler = (res: IncomingMessage) => {
            let responseBody = Buffer.from([])
            res.on('error', reject)
            res.on('data', (chunk: Buffer) => {
                responseBody = Buffer.concat([responseBody, chunk])
            })
            res.on('end', () => {
                if (res.statusCode! === 204) {
                    resolve('{}')
                    return
                }
                if (res.statusCode! >= 400) {
                    reject(
                        new VaultErrorResponse(
                            res.statusCode!,
                            responseBody.toString('utf-8')
                        )
                    )
                } else {
                    resolve(responseBody.toString('utf-8'))
                }
            })
        }

        const bb = JSON.stringify(body) || ''

        const options: RequestOptions = {
            host,
            method,
            path,
            timeout,
            port,
            headers: {
                'X-Vault-Token': token,
                'X-Vault-Request': 'true',
                'Content-Type': 'application/json',
            },
        }

        let req: ClientRequest
        if (secure) {
            req = https.request(options, responseHandler)
        } else {
            req = http.request(options, responseHandler)
        }
        req.on('error', reject)
        req.write(bb)
        req.end()
    })
}
