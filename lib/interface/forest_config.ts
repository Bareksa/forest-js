export interface ForestConfig {
    host?: string
    kvEngine?: string
    timeout?: number
    port?: number
    ssl?: boolean
    // TODO: add namespace support in the future
}
