export interface ForestConfig {
    /**
     * The default kvEngine is 'kv' if not set
     */
    kvEngine?: string
    /**
     * The default timeout is 15000 milliseconds
     */
    timeout?: number
    // TODO: add namespace support in the future
}
