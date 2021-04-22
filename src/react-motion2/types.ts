export type Style = { [key: string]: number | OpaqueConfig };

export type PlainStyle = { [key: string]: number };

export type Velocity = { [key: string]: number };

export interface OpaqueConfig {
    val: number;
    stiffness: number;
    damping: number;
    precision: number;
}

export interface SpringHelperConfig {
    stiffness?: number;
    damping?: number;
    precision?: number;
}