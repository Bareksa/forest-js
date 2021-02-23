import { ForestConfig } from '../../interface/forest_config.js'

export default interface ForestConfigInternal extends ForestConfig {
    kvEngine: string
    timeout: number
    secure: boolean
}
