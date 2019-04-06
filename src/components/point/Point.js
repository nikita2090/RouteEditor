import React from 'react';
import PropTypes from 'prop-types';

import './Point.css';


const Point = ({value, id, deletePoint}) => (
    <div className="point" id ={id}>
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
};

Point.defaultProps = {
    value: '',
    id: 0,
    deletePoint: () => {},
};

export default Point;