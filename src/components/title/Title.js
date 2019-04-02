import React from 'react';
import PropTypes from 'prop-types';

import './Title.css';


const Title = ({text}) => (
    <header>
        <h1 className="title">{text}</h1>
    </header>
);


Title.propTypes = {
    text: PropTypes.string
};

Title.defaultProps = {
    text: 'Simple text'
};

export default Title;