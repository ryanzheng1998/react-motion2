import { PlainStyle, Style } from "./types";

export const mapToZero = (obj: Style | PlainStyle): PlainStyle => {
    let ret: PlainStyle = {}
    for(const key in obj){
        if(!obj.hasOwnProperty(key)){
            continue
        }
        ret[key] = 0
    }
    return ret
}