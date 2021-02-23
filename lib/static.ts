import { Forest } from './instance.js'
import { ForestConfig } from './interface/forest_config.js'

let instance: Forest

/**
 * Use either global or instance pattern.
 *
 * ## Global Pattern
 *
 * For using global, init must be called, otherwise will return undefined error when calling other methods.
 *
 * ### Example
 *
 * ```
 * const Forest = require('forest')
 * Forest.init(token, host)
 *
 * const data = Forest.getKeyValue('some-conf')
 * ```
 *
 * ## Instance Pattern
 *
 * ### Example
 *
 * ```
 * const Forest = require('forest')
 * const forestInstance = Forest.createInstance(token, host)
 *
 * const data = forestInstance.getKeyValue('some-conf')
 * ```
 */
export default class ForestStatic {
    /**
     * initializes global forest instance.
     * please note that if config is not given, the default kv engine is 'kv'
     */
    static init(token: string, host = 'localhost:8200', config?: ForestConfig) {
        instance = new Forest(token, host, config)
    }

    /**
     * initializes a forest instance.
     * please note that if config is not given, the default kv engine is 'kv'
     */
    static createInstance(
        token: string,
        host = 'localhost:8200',
        config?: ForestConfig
    ) {
        return new Forest(token, host, config)
    }

    /**
     * gets the resource from a kv engine
     */
    static async getKeyValue<T = any>(key: string): Promise<T> {
        return instance.getKeyValue<T>(key)
    }
}
