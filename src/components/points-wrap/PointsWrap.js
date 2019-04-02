import React from 'react';
import PropTypes from 'prop-types';

import './PointsWrap.css';


const PointsWrap = ({children}) => (
    <div className="pointsWrap">{children}</div>
);


PointsWrap.propTypes = {
    children: PropTypes.node
};

PointsWrap.defaultProps = {
    children: null
};

export default PointsWrap;