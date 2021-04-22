import presents from './presents'
import { OpaqueConfig, SpringHelperConfig } from './types'

export const spring = (val: number, config?: SpringHelperConfig): OpaqueConfig => {
    const defaultConfig = {
        ...presents.noWobble,
        precision: 0.01,
    }

    return { ...defaultConfig, ...config, val }
}