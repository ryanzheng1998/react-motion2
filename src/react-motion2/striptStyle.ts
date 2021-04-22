// https://github.com/chenglou/react-motion/blob/9e3ce95bacaa9a1b259f969870a21c727232cc68/src/stripStyle.js#L7
import { PlainStyle, Style } from "./types"

export const stripStyle = (style: Style): PlainStyle => {
    let ret: PlainStyle = {};
    for (const key in style) {
      if (!style.hasOwnProperty(key)) {
        continue
      }
      const temp = style[key]
      ret[key] = typeof temp === 'number' ? temp : temp.val
    }
    return ret
}