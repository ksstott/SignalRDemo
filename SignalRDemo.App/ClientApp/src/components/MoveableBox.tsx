import React, { FunctionComponent, useState } from "react";

interface MoveableBoxProps {
    position: { x: number, y: number };
    onMove: (position: { x: number, y: number }) => void;
}

export const MoveableBox: FunctionComponent<MoveableBoxProps> = ({ position, onMove }) => {
    const [statePosition, setStateStatePosition] = useState(position);

    function onDrag(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        // console.log(e.pageX, e.pageY);
        onMove({ x: e.pageX, y: e.pageY });
    }

    return (
        <div style={{
            width: "200px",
            height: "200px",
            backgroundColor: "red",
            top: position.y,
            left: position.x,
            position: "absolute"
        }} draggable onDragEnd={onDrag}> This is a MoveableBox</div>
    )
}
