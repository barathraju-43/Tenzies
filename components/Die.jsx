import React from "react"

export default function Die(props) {
    return (
        <div onClick={props.handleHeld} className={`die-face ${props.isHeld ? "held" : ""}`}>
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}