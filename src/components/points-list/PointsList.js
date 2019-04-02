import React from 'react';
import PropTypes from 'prop-types';

import Point from '../point/Point';

import './PointsList.css';


const PointsList = ({points, deletePoint}) => (
    <div>
        {points.map((point) => (
            <Point key={point.id}
                   value={point.name}
                   id={point.id}
                   deletePoint={deletePoint}
            />
        ))}
    </div>
);


PointsList.propTypes = {
    routes: PropTypes.array
};

PointsList.defaultProps = {
    routes: []
};

export default React.memo(PointsList);