import 'jest'
import { Forest } from '../../lib'
import { VaultErrorResponse } from '../../lib/internal/interface/vault_response'
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
        '/v1/kv/__test__',
        'PUT',
        {
            bar: 'baz',
            cotto: 'matte',
        }
    )
})

describe('testing key value', () => {
    test('success kv engine', async () => {
        Forest.init(process.env.VAULT_TOKEN!, process.env.VAULT_HOST!)

        const data = await Forest.getKeyValue<Foo>('__test__')
        expect(data).toHaveProperty('bar')
        expect(data).toHaveProperty('cotto')
        expect(data.bar).toEqual('baz')
        expect(data.cotto).toEqual('matte')
    })

    test('fail get kv engine', async () => {
        Forest.init(process.env.VAULT_TOKEN!, process.env.VAULT_HOST!)
        try {
            await Forest.getKeyValue('asdfasdfasdf')
        } catch (e) {
            expect(e).toBeInstanceOf(VaultErrorResponse)
            const err = e as VaultErrorResponse
            expect(err.message).toEqual('resource not found')
            expect(err.errors).toEqual(['resource not found'])
        }
    })
})

afterAll(() =>
    doRequest(
        process.env.VAULT_TOKEN!,
        process.env.VAULT_TEST_HOST!,
        '/v1/kv/__test__',
        'DELETE'
    )
)
