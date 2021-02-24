import 'jest'
import { Forest, ForestInstance } from '../lib'

describe('library declaration', () => {
    test('success declaring forest instance with default values', () => {
        const want = new ForestInstance('aaa')
        const got = Forest.createInstance('aaa')
        expect(got).toBeInstanceOf(ForestInstance)
        expect(got).toEqual(want)
        expect(got.token).toEqual('aaa')
        expect(got.host).toEqual('localhost')
        expect(got.port).toEqual(8200)
        expect(got.config.secure).toEqual(false)
    })

    test('declaring with dns resolved name', () => {
        const got = new ForestInstance('aaa', 'http://example.com')
        expect(got.host).toEqual('example.com')
        expect(got.port).toEqual(8200)
        expect(got.config.secure).toEqual(false)
    })

    test('using https', () => {
        const got = new ForestInstance('aaa', 'https://example.com')
        expect(got.host).toEqual('example.com')
        expect(got.port).toEqual(8200)
        expect(got.config.secure).toEqual(true)
    })
})
