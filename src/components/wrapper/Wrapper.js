import React from 'react';
import PropTypes from 'prop-types';

import './Wrapper.css';


const Wrapper = ({children}) => (
    <div className="wrapper">{children}</div>
);


Wrapper.propTypes = {
    children: PropTypes.node
};

Wrapper.defaultProps = {
    children: null
};

export default Wrapper;