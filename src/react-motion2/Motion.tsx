import React from 'react'
import { mapToZero } from './mapToZero'
import { stripStyle } from './striptStyle'
import { stepper } from './stepper'
import { PlainStyle, Style, Velocity } from './types'
import shouldStopAnimation from './shouldStopAnimation'

// ----------------------
// state model
// ----------------------
interface Props {
    defaultStyle?: PlainStyle;
    style: Style;
    children: (interpolatedStyle: PlainStyle) => JSX.Element;
    onRest?: () => void;
}

interface State {
    timeStamp: number;
    updateCount: number;
    currentStyle: PlainStyle;
    currentVelocity: Velocity;
    lastIdealStyle: PlainStyle;
    lastIdealVelocity: Velocity;
}

// ----------------------
// action model
// ----------------------
const tick = (tick: number, style: Style) => ({
    type: 'TICK' as const,
    payload: {timeStamp: tick, propStyle: style},
})

type Action = ReturnType<typeof tick>

// ----------------------
// pure function
// ----------------------
const steppers = (state: State) => (propStyle: Style): [PlainStyle, Velocity] => {
    const currentFrameCompletion = (state.timeStamp - state.updateCount * 10) / 10
    
    for(let key in propStyle){
        if (!propStyle.hasOwnProperty(key)) {
            continue;
        }

        const currentPropStyle = propStyle[key]

        if(typeof(currentPropStyle) === 'number') {
            state.currentStyle[key] = currentPropStyle
            state.currentVelocity[key] = 0
            state.lastIdealStyle[key] = currentPropStyle
            state.lastIdealVelocity[key] = 0
        } else {
            const [newLastIdealStyleValue, newLastIdealVelocityValue] = stepper(
                10 / 1000,
                state.lastIdealStyle[key],
                state.lastIdealVelocity[key],
                currentPropStyle.val,
                currentPropStyle.stiffness,
                currentPropStyle.damping,
                currentPropStyle.precision,
            )

            const [nextIdealX, nextIdealV] = stepper(
                10 / 1000,
                newLastIdealStyleValue,
                newLastIdealVelocityValue,
                currentPropStyle.val,
                currentPropStyle.stiffness,
                currentPropStyle.damping,
                currentPropStyle.precision,
            )

            state.currentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion
            state.currentVelocity[key] = newLastIdealVelocityValue +  (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion
            state.lastIdealStyle[key] = newLastIdealStyleValue
            state.lastIdealVelocity[key] = newLastIdealVelocityValue

        }
    }

    return [state.currentStyle, state.currentVelocity]
}

// ----------------------
// update
// ----------------------
const reducer = (state: State, action: Action): State => {
    switch(action.type){
        case 'TICK':

            const [currentStyle, currentVelocity] = steppers(state)(action.payload.propStyle)

            const shouldBeThisVersion: number = state.timeStamp / 10
            const behindVersion: boolean = shouldBeThisVersion > state.updateCount
            const tooFarBehind: boolean = shouldBeThisVersion + 50 > state.updateCount

            const finalState: State = {
              ...state,
              timeStamp: action.payload.timeStamp,
              updateCount: state.updateCount + 1,
              currentStyle: currentStyle,
              currentVelocity: currentVelocity,
            }
      
            return behindVersion && !tooFarBehind ? reducer(finalState, action) : finalState
    }
}


// ----------------------
// draw
// ----------------------
const Motion: React.FC<Props> = (p) => {

    const initState: State = {
        timeStamp: 0,
        updateCount: 0,
        currentStyle: p.defaultStyle || stripStyle(p.style),
        currentVelocity: mapToZero(p.defaultStyle || stripStyle(p.style)),
        lastIdealStyle: p.defaultStyle || stripStyle(p.style),
        lastIdealVelocity: mapToZero(p.defaultStyle || stripStyle(p.style)),
    }

    const [state, dispatch] = React.useReducer(reducer, initState)

    const animationRef = React.useRef(0)
  
    const step = React.useCallback((t1: number) => (t2: number) => {
        if (t2 - t1 > 10) {
            if(shouldStopAnimation(state.currentStyle, p.style, state.currentVelocity)) {
                if (p.onRest) {
                    p.onRest()
                }
                return
            }
            dispatch(tick(t2, p.style))
            animationRef.current = requestAnimationFrame(step(t2))
        } else {
            animationRef.current = requestAnimationFrame(step(t1))
        }
    }, [p, state.currentStyle, state.currentVelocity])
  
    React.useEffect(() => {
      animationRef.current = requestAnimationFrame(step(0))
      return () => cancelAnimationFrame(animationRef.current)
    }, [step])

    return p.children(state.currentStyle)
}

export default Motion