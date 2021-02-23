import 'jest'
import ForestStatic, { Forest } from '..'

test('declaring forest instance', () => {
    it('success', () => {
        const want = new Forest('aaa')
        const got = ForestStatic.createInstance('aaa')
        expect(got).toBeInstanceOf(Forest)
        expect(got).toEqual(want)
    })
})
