import 'jest'
import ForestStatic, { Forest } from '../lib'

describe('library declaration', () => {
    test('success declaring forest instance', () => {
        const want = new Forest('aaa')
        const got = ForestStatic.createInstance('aaa')
        expect(got).toBeInstanceOf(Forest)
        expect(got).toEqual(want)
    })
})
