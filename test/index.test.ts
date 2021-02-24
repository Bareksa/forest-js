import 'jest'
import { Forest, ForestInstance } from '../lib'

describe('library declaration', () => {
    test('success declaring forest instance', () => {
        const want = new ForestInstance('aaa')
        const got = Forest.createInstance('aaa')
        expect(got).toBeInstanceOf(ForestInstance)
        expect(got).toEqual(want)
    })
})
