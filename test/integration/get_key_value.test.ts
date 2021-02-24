import 'jest'
import { Forest } from '../../lib'
import doRequest from '../../lib/internal/repo/request_gen'
interface Foo {
    bar: string
    cotto: string
}

beforeAll(() => {
    require('dotenv').config()
    return doRequest(
        process.env.VAULT_TOKEN!,
        process.env.VAULT_TEST_HOST!,
        parseInt(process.env.VAULT_TEST_PORT!),
        '/v1/kv/__test__',
        'PUT',
        {
            bar: 'baz',
            cotto: 'matte',
        }
    )
})

describe('testing key value', () => {
    test('success default kv engine', async () => {
        Forest.init(process.env.VAULT_TOKEN!, process.env.VAULT_HOST!)
        Forest.getKeyValue('foo')

        const data = await Forest.getKeyValue<Foo>('__test__')
        expect(data).toHaveProperty('bar')
        expect(data).toHaveProperty('cotto')
        expect(data.bar).toEqual('baz')
        expect(data.cotto).toEqual('matte')
    })
})

afterAll(() =>
    doRequest(
        process.env.VAULT_TOKEN!,
        process.env.VAULT_TEST_HOST!,
        parseInt(process.env.VAULT_TEST_PORT!),
        '/v1/kv/__test__',
        'DELETE'
    )
)
