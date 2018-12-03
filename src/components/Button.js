import React from 'react';
import './Button.css';

const Button = ({message, loading, onClick}) => {
    const content = loading === true ? /*<div className="loader"></div>*/
        <div><i className="fa fa-spinner fa-spin"></i> Loading</div> : message;

    return (
        <div className='button-container'>
            <button className="button blue" onClick={onClick}>
                {content}
            </button>
        </div>
    );
};

export default Button;