import { ForestConfig } from '../../interface/forest_config'

export default interface ForestConfigInternal extends ForestConfig {
    kvEngine: string
    timeout: number
    host: string
}
