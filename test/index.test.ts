import 'jest'
import { Forest, ForestInstance } from '../lib'

describe('library declaration', () => {
    test('success declaring forest instance with default values', () => {
        const want = new ForestInstance('aaa')
        const got = Forest.createInstance('aaa')
        expect(got).toBeInstanceOf(ForestInstance)
        expect(got).toEqual(want)
        expect(got.token).toEqual('aaa')
        expect(got.host).toEqual('http://localhost:8200')
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
