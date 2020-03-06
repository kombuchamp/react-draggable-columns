import React, { useEffect } from 'react';
import css from './Header.module.css';
import { Resizable, ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';

import { DispatchContext } from './Table';

const Header = ({
    columns,
    onColumnDragStart,
    onColumnDrag,
    onColumnDragStop,
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
                            axis={'x'}
                            position={{ x: 0, y: 0 }}
                            onStart={(e, dragData) => {
                                onColumnDragStart(index);
                                queueMicrotask(() =>
                                    dragData.node.classList.add(css.dragging)
                                );
                            }}
                            onDrag={(e, dragData) => onColumnDrag(dragData.x)}
                            onStop={(e, dragData) => {
                                dragData.node.classList.remove(css.dragging);
                                onColumnDragStop();
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
