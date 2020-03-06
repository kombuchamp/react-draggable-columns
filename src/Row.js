import React from 'react';
import css from './Row.module.css';

const Row = ({ columns }) => {
    return (
        <div className={css.row}>
            {columns.map(({ name, size }, index) => (
                <div style={{ width: size }} key={index}>
                    {name}
                </div>
            ))}
        </div>
    );
};

export default Row;
