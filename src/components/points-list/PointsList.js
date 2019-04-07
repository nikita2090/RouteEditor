import React from 'react';
import PropTypes from 'prop-types';

import Point from '../point/Point';


const PointsList = ({points, deletePoint}) => (
    <div className="pointList">
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
    points: PropTypes.array,
    deletePoint: PropTypes.func,
};

PointsList.defaultProps = {
    points: [],
    deletePoint: () => {},
};

export default React.memo(PointsList);