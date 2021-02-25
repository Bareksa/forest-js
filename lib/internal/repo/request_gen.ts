import Axios, { AxiosError, AxiosResponse } from 'axios'
import {
    VaultErrorResponse,
    VaultSuccessResponse,
} from '../interface/vault_response'

interface Body {
    [key: string]: any
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * The body is any json compatible requests.
 */
export default async function doRequest<T = any>(
    token: string,
    host: string,
    path: string,
    method: Method,
    body?: Body | Body[],
    timeout = 15000
) {
    try {
        const response: AxiosResponse<VaultSuccessResponse<T>> = await Axios({
            url: `${host}${path}`,
            data: body,
            timeout,
            method,
            headers: {
                'X-Vault-Token': token,
                'X-VaultRequest': 'true',
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (e) {
        const err = e as AxiosError<VaultErrorResponse>
        throw new VaultErrorResponse(
            err.response!.status,
            JSON.stringify(err.response?.data)
        )
    }
}
