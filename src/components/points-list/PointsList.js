import React from 'react';
import PropTypes from 'prop-types';

import Point from '../point/Point';

import './PointsList.css';


const PointsList = ({points, deletePoint, onDragPoint}) => (
    <div id="pointsList"
         className="pointList">
        {points.map((point) => (
            <Point key={point.id}
                   value={point.name}
                   id={point.id}
                   deletePoint={deletePoint}
                   onDragPoint={onDragPoint}
            />
        ))}
    </div>
);


PointsList.propTypes = {
    points: PropTypes.array,
    deletePoint: PropTypes.func,
    onDragPoint: PropTypes.func
};

PointsList.defaultProps = {
    points: [],
    deletePoint: () => {},
    onDragPoint: () => {}
};

export default React.memo(PointsList);