import 'jest'
import { Forest } from '../../lib'
import doRequest from '../../lib/internal/repo/request_gen'
class Foo {
    static bar: string
    static cotto: string
    static xxx: number
    static choco: string[]
    static latte: number[]
}

const PATH = '/v1/kv/__test1__'

beforeAll(() => {
    require('dotenv').config()
    return doRequest(
        process.env.VAULT_TOKEN!,
        process.env.VAULT_TEST_HOST!,
        parseInt(process.env.VAULT_TEST_PORT!),
        PATH,
        'PUT',
        {
            bar: 'baz',
            cotto: 'matte',
            xxx: 12345,
            choco: ['c', 'h', 'o', 'c', 'o'],
            latte: [0, 1, 2, 3, 4, 5],
            are: { you: { winning: { watson: '?' } } },
        }
    )
})

describe('manage key value test', () => {
    test('success manage key value', async () => {
        Forest.init(process.env.VAULT_TOKEN!, process.env.VAULT_HOST!)
        await Forest.manageKeyValue('__test1__')
        const bar = Forest.getString('bar')
        expect(typeof bar).toEqual('string')
        const areYouWinningWatson = Forest.getString('are.you.winning.watson')
        expect(areYouWinningWatson).toEqual('?')
        const xxx = Forest.getNumber('xxx')
        expect(typeof xxx).toEqual('number')
        const choco = Forest.getStringArray('choco')
        expect(Array.isArray(choco)).toBe(true)
        choco.forEach((el) => expect(typeof el).toEqual('string'))
        const latte = Forest.getNumberArray('latte')
        expect(Array.isArray(latte)).toBe(true)

        const are = Forest.parseString('are')
        expect(are).toEqual(`{"you":{"winning":{"watson":"?"}}}`)
        const mottoNumber = Forest.parseNumber('cotto')
        expect(mottoNumber).toEqual(0)

        const foo = Forest.getAsClass(Foo)
        expect(foo.xxx).toEqual(12345)
    })
})

afterAll(() =>
    doRequest(
        process.env.VAULT_TOKEN!,
        process.env.VAULT_TEST_HOST!,
        parseInt(process.env.VAULT_TEST_PORT!),
        PATH,
        'DELETE'
    )
)
