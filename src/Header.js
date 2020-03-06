import React, { useEffect } from 'react';
import css from './Header.module.css';
import Draggable from 'react-draggable';

import { DispatchContext } from './Table';
import DraggingPhantom from './DraggingPhantom';
import Resizer from './Resizer';

const Header = ({
    columns,
    onColumnResizeStart,
    onColumnResize,
    onColumnResizeStop,
    onDragStop,
}) => {
    const dispatch = React.useContext(DispatchContext);

    return (
        <div className={css.header}>
            {columns.map(({ name, size }, index) => {
                return (
                    <div
                        key={index}
                        className={css.headerCell}
                        style={{ width: size }}
                    >
                        {name}
                        <DraggingPhantom
                            onStart={(e, dragData) => {
                                dragData.node.style.opacity = '0.5';
                            }}
                            onStop={(e, dragData) => {
                                dragData.node.style.opacity = '0';
                                onDragStop(dragData.x, index);
                            }}
                        >
                            {name}
                        </DraggingPhantom>
                        <Resizer
                            onStart={(e, dragData) => {
                                e.stopPropagation();
                                onColumnResizeStart(index);
                                queueMicrotask(() =>
                                    dragData.node.classList.add(css.resizing)
                                );
                            }}
                            onDrag={(e, dragData) => onColumnResize(dragData.x)}
                            onStop={(e, dragData) => {
                                dragData.node.classList.remove(css.resizing);
                                onColumnResizeStop();
                                dispatch({
                                    type: 'COLUMN_RESIZE',
                                    payload: {
                                        columnName: name,
                                        delta: dragData.x,
                                    },
                                });
                            }}
                        >
                            <div className={css.resizer} />
                        </Resizer>
                    </div>
                );
            })}
        </div>
    );
};

export default Header;
