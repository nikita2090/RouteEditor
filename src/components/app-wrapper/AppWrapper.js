import React from 'react';
import PropTypes from 'prop-types';

import './AppWrapper.css';


const AppWrapper = ({children}) => (
    <div className="wrapper">{children}</div>
);


AppWrapper.propTypes = {
    children: PropTypes.node
};

AppWrapper.defaultProps = {
    children: null
};

export default AppWrapper;