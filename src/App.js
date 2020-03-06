import React, { useEffect } from 'react';
import './App.css';
import css from './App.module.css';
import Header from './Header';
import Row from './Row';
import { ResizableBox } from 'react-resizable';
import classnames from 'classnames';

export const DispatchContext = React.createContext(null);

function reducer(state = {}, action) {
    switch (action.type) {
        case 'COLUMN_RESIZE':
            const { columnName, delta } = action.payload;
            const targetColumnIdx = state.columns.findIndex(
                col => col.name === columnName
            );
            const [column, nextColumn] = state.columns.slice(
                targetColumnIdx,
                targetColumnIdx + 2
            );
            const newSize = Math.min(
                // 800 - state.columns.length * 50,
                Math.max(50, column.size + delta)
            );
            if (column.size !== newSize) {
                // if (nextColumn)
                //     nextColumn.size = Math.max(
                //         50,
                //         nextColumn.size - newSize - column.size
                //     );
                column.size = newSize;
            }
    }
    return { ...state };
}

function App() {
    const [state, dispatch] = React.useReducer(reducer, {
        columns: ['foo', 'bar', 'baz', 'qux', 'quz'].map(name => ({
            name,
            size: 800 / 5,
        })),
    });

    const tableRef = React.useRef();
    const rulerRef = React.useRef(getRuler());

    return (
        <DispatchContext.Provider value={dispatch}>
            <div className={classnames(css.table, 'root-table')} ref={tableRef}>
                <Header
                    columns={state.columns}
                    onColumnDragStart={index => {
                        const left = state.columns
                            .slice(0, index + 1)
                            .reduce((result, { size }) => result + size, 0);
                        rulerRef.current.style.left = left - 5 + 'px';
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
        width: '5px',
        top: 0,
        bottom: 0,
        backgroundColor: '#ff00000f',
    });
    return ruler;
}

export default App;
