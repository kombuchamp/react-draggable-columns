import React, { useEffect } from 'react';
import css from './Table.module.css';
import Header from './Header';
import Row from './Row';
import { ResizableBox } from 'react-resizable';
import classNames from 'classnames';

const RULER_WIDTH = 5;

export const DispatchContext = React.createContext(null);

function reducer(state = {}, action) {
    switch (action.type) {
        case 'INIT':
            state = action.payload;
            break;
        case 'COLUMN_RESIZE':
            const { columnName, delta } = action.payload;
            const targetColumnIdx = state.columns.findIndex(
                col => col.name === columnName
            );
            const [column, nextColumn] = state.columns.slice(
                targetColumnIdx,
                targetColumnIdx + 2
            );
            const newSize = Math.min(Math.max(50, column.size + delta));
            if (column.size !== newSize) {
                column.size = newSize;
            }
            break;
        case 'SWAP_COLUMNS':
            const { columns } = state;
            const { index1, index2 } = action.payload;
            [columns[index1], columns[index2]] = [
                columns[index2],
                columns[index1],
            ];
    }
    return { ...state };
}

function Table() {
    const [state, dispatch] = React.useReducer(reducer, { columns: [] });

    const tableRef = React.useRef();
    const rulerRef = React.useRef(getRuler());

    useEffect(() => {
        const width = tableRef.current.clientWidth || 800; // Might be 0 in IE
        dispatch({
            type: 'INIT',
            payload: {
                columns: ['foo', 'bar', 'baz', 'qux', 'quz'].map(name => ({
                    name,
                    size: width / 5,
                })),
            },
        });
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <div className={classNames(css.table, 'root-table')} ref={tableRef}>
                <Header
                    columns={state.columns}
                    onColumnResizeStart={index => {
                        const left = state.columns
                            .slice(0, index + 1)
                            .reduce((result, { size }) => result + size, 0);
                        rulerRef.current.style.left = left - RULER_WIDTH + 'px';
                        tableRef.current.appendChild(rulerRef.current);
                    }}
                    onColumnResize={x => {
                        rulerRef.current.style.transform = `translateX(${x}px)`;
                    }}
                    onColumnResizeStop={() => {
                        rulerRef.current.style.transform = '';
                        tableRef.current.removeChild(rulerRef.current);
                    }}
                    onDragStop={(x, index) => {
                        const isDraggingLeft = x < 0;
                        x = Math.abs(x);
                        if (x < 50) return;
                        const targetWidth = state.columns[index].size;
                        x = x - targetWidth / 2;
                        let start = isDraggingLeft ? index - 1 : index + 1;
                        let increment = isDraggingLeft ? -1 : 1;
                        let i;
                        for (
                            i = start;
                            i >= 0 && i < state.columns.length;
                            i += increment
                        ) {
                            const colSize = state.columns[i].size;
                            if (x < colSize) break;
                            x -= colSize;
                        }
                        dispatch({
                            type: 'SWAP_COLUMNS',
                            payload: {
                                index1: index,
                                index2: Math.max(
                                    0,
                                    Math.min(i, state.columns.length - 1)
                                ),
                            },
                        });
                    }}
                />
                {Array(10)
                    .fill(null)
                    .map((_, i) => (
                        <Row key={i} columns={state.columns} />
                    ))}
            </div>
        </DispatchContext.Provider>
    );
}

function getRuler() {
    const ruler = document.createElement('div');
    Object.assign(ruler.style, {
        position: 'absolute',
        width: RULER_WIDTH + 'px',
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,0,0,0.2)',
    });
    return ruler;
}

export default Table;
