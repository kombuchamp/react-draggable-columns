import Draggable from 'react-draggable';
import React from 'react';

export default function DraggingPhantom({ onStart, onDrag, onStop, children }) {
    return (
        <Draggable
            position={{ x: 0, y: 0 }}
            axis={'x'}
            onStart={onStart}
            onDrag={onDrag}
            onStop={onStop}
        >
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: '#f0ffffc0',
                    opacity: '0',
                }}
            >
                {children}
            </div>
        </Draggable>
    );
}
