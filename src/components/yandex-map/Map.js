import React from 'react';
import PropTypes from 'prop-types';

import './Map.css';


const Map = ({children}) => (
    <div className="map"
         id="map">
        {children}
    </div>
);


Map.propTypes = {

};

Map.defaultProps = {

};

export default Map;




