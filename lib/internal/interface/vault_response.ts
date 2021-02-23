export interface VaultSuccessResponse<T = any> {
    request_id: string
    lease_id: string
    renewable: boolean
    lease_duration: number
    data: T
    wrap_info: null
    warnings: null
    auth: null
}

export class VaultErrorResponse implements Error {
    public errors: string[]
    public kind: string
    constructor(public code: number, err: string) {
        const e = JSON.parse(err)
        this.errors = (e['errors'] as string[]) || ['']
        this.kind = 'VaultErrorResponse'
    }

    get message() {
        let m = this.errors.join(', ')
        if (m === '') {
            m = 'resource not found'
        }
        return m
    }

    get name() {
        return this.kind
    }
}
