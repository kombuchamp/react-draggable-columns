import React, { useEffect } from 'react';
import css from './Header.module.css';
import Draggable from 'react-draggable';

import { DispatchContext } from './Table';

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
                        <Draggable
                            position={{ x: 0, y: 0 }}
                            axis={'x'}
                            onStop={(e, dragData) =>
                                onDragStop(dragData.x, index)
                            }
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    background: '#f0ffffc0',
                                }}
                            />
                        </Draggable>
                        <Draggable
                            axis={'x'}
                            position={{ x: 0, y: 0 }}
                            onStart={(e, dragData) => {
                                e.stopPropagation();
                                onColumnResizeStart(index);
                                queueMicrotask(() =>
                                    dragData.node.classList.add(css.dragging)
                                );
                            }}
                            onDrag={(e, dragData) => onColumnResize(dragData.x)}
                            onStop={(e, dragData) => {
                                dragData.node.classList.remove(css.dragging);
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
                            <div className={css.dragger} />
                        </Draggable>
                    </div>
                );
            })}
        </div>
    );
};

export default Header;
