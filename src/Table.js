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
    }
    return { ...state };
}

function Table() {
    const [state, dispatch] = React.useReducer(reducer, { columns: [] });

    const tableRef = React.useRef();
    const rulerRef = React.useRef(getRuler());

    useEffect(() => {
        const { clientWidth } = tableRef.current;
        dispatch({
            type: 'INIT',
            payload: {
                columns: ['foo', 'bar', 'baz', 'qux', 'quz'].map(name => ({
                    name,
                    size: clientWidth / 5,
                })),
            },
        });
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <div className={classNames(css.table, 'root-table')} ref={tableRef}>
                <Header
                    columns={state.columns}
                    onColumnDragStart={index => {
                        const left = state.columns
                            .slice(0, index + 1)
                            .reduce((result, { size }) => result + size, 0);
                        rulerRef.current.style.left = left - RULER_WIDTH + 'px';
                        tableRef.current.appendChild(rulerRef.current);
                    }}
                    onColumnDrag={x => {
                        rulerRef.current.style.transform = `translateX(${x}px)`;
                    }}
                    onColumnDragStop={() => {
                        rulerRef.current.style.transform = '';
                        tableRef.current.removeChild(rulerRef.current);
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
        backgroundColor: '#ff00000f',
    });
    return ruler;
}

export default Table;
