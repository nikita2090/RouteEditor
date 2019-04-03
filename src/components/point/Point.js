import React from 'react';
import PropTypes from 'prop-types';

import './Point.css';


const Point = ({value, id, deletePoint, onDragPoint}) => (
    <div className="point"
         onMouseDown={e => onDragPoint(id, e)}
         onDragStart={() => false}>
        <span className="pointName">
            {value}
        </span>
        <i className="fas fa-times"
           onClick={(e) => deletePoint(id, e)}/>
    </div>
);


Point.propTypes = {
    value: PropTypes.string,
    id: PropTypes.number,
    deletePoint: PropTypes.func,
    onDragPoint: PropTypes.func,
};

Point.defaultProps = {
    value: '',
    id: 0,
    deletePoint: () => {},
    onDragPoint: () => {},
};

export default Point;