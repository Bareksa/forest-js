import { Forest } from './instance'
import { ForestConfig } from './interface/forest_config'

const DEFAULT_HOST = 'http://localhost:8200'

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
    static init(token: string, host = DEFAULT_HOST, config?: ForestConfig) {
        instance = new Forest(token, host, config)
    }

    /**
     * initializes a forest instance.
     * please note that if config is not given, the default kv engine is 'kv'
     */
    static createInstance(
        token: string,
        host = DEFAULT_HOST,
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

    /**
     * Fetch key value from vault, stores the object in memory, and primes it for getString, getNumber, etc methods
     */
    static async manageKeyValue(key: string) {
        await instance.manageKeyValue(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered string.
     * No cast is done.
     * Returns empty string if no value is found.
     */
    static getString(key: string): string {
        return instance.getString(key)
    }

    /**
     * get value from the key on stored object and attempt
     * to parse it.
     * Returns empty string if no value is found.
     */
    static parseString(key: string): string {
        return instance.parseString(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered number.
     * No cast is done.
     * Returns 0 if no value is found.
     */
    static getNumber(key: string): number {
        return instance.getNumber(key)
    }

    /**
     * get value from the key on stored object and attempt
     * to parse it.
     * Returns 0 if no value is found or cannot be parsed.
     */
    static parseNumber(key: string): number {
        return instance.parseNumber(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered string array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    static getStringArray(key: string): string[] {
        return instance.getStringArray(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    static getArray(key: string): any[] {
        return instance.getArray(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered number array.
     * No cast is done.
     * Returns empty array if no value is found.
     */
    static getNumberArray(key: string): number[] {
        return instance.getNumberArray(key)
    }

    /**
     * get value from the key on stored object.
     * Result value is considered the given class.
     * No cast is done.
     * Returned value ***is undefined*** if no value is found
     */
    static getAsClass<T>(key: string, _class: T): T {
        return instance.getAsClass(key, _class)
    }
}
