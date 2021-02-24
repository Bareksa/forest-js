import { ForestConfig } from '../../interface/forest_config'

export default interface ForestConfigInternal extends ForestConfig {
    kvEngine: string
    timeout: number
    port: number
    host: string
    secure: boolean
}
