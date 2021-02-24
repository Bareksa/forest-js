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

    test('infer http by default', () => {
        const got = new ForestInstance('aaa', 'example.com')
        expect(got.host).toEqual('example.com')
        expect(got.port).toEqual(8200)
        expect(got.config.secure).toEqual(false)
    })

    test('get port', () => {
        const got = new ForestInstance('aaa', 'https://example.com:9999/asdf')
        expect(got.host).toEqual('example.com')
        expect(got.port).toEqual(9999)
        expect(got.config.secure).toEqual(true)
    })

    test('expect fail on empty token', () => {
        try {
            //@ts-ignore
            new ForestInstance()
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toEqual('empty vault token string')
        }
        try {
            new ForestInstance('')
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toEqual('empty vault token string')
        }
    })

    test('expect fail on bad port', () => {
        try {
            new ForestInstance('z', 'http://zxcv:qwerty')
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toEqual(
                `cannot parse into number for port from value: 'qwerty'`
            )
        }
    })

    test('expect fail on unsupported protocol', () => {
        try {
            new ForestInstance('z', 'ws://localhost:8200')
        } catch (e) {
            expect(e).toBeInstanceOf(Error)
            expect(e.message).toEqual(`protocol 'ws' is not supported`)
        }
    })
})
