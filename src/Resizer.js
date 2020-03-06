import Draggable from 'react-draggable';
import React from 'react';

export default function Resizer({ onStart, onDrag, onStop, children }) {
    return (
        <Draggable
            axis={'x'}
            position={{ x: 0, y: 0 }}
            onStart={onStart}
            onDrag={onDrag}
            onStop={onStop}
        >
            {children}
        </Draggable>
    );
}
