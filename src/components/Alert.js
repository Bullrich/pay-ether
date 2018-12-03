import React from 'react';
import './Alert.css';

const Alert = ({message, status}) => {
    if (message !== '')
        return (
            <div className={`alert ${status}`}>
                {message}
            </div>
        );
    else return <div></div>;
};

export default Alert;