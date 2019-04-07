import React from 'react';
import PropTypes from 'prop-types';

import './Input.css';


const Input = React.forwardRef(({value, handleInputChange, onEnterPress, tooltip}, ref) => (
    <>
    {tooltip && <div className="tooltip">not found</div>}
    <input type="text"
           className="input"
           value={value}
           onChange={handleInputChange}
           onKeyPress={onEnterPress}
           placeholder="Search..."
           ref={ref}
    />
    </>
));


Input.propTypes = {
    value: PropTypes.string,
    handleInputChange: PropTypes.func,
    onEnterPress: PropTypes.func,
    tooltip: PropTypes.bool
};

Input.defaultProps = {
    value: '',
    handleInputChange: () => {},
    onEnterPress: () => {},
    tooltip: false
};

export default React.memo(Input);

