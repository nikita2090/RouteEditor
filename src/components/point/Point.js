import React from 'react';
import PropTypes from 'prop-types';

import './Point.css';


const Point = ({value, id, deletePoint}) => (
    <div className="point">
        <span className="pointName">
            {value}
        </span>
        <i className="fas fa-times"
           onClick={(e) => deletePoint(id, e)}/>
    </div>
);



Point.propTypes = {
    value: PropTypes.string
};

Point.defaultProps = {
    value: ''
};

export default Point;