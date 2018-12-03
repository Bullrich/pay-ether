import React from 'react';
import Modal from 'react-awesome-modal';
import './AlertModal.css';

const AlertModal = ({show, onClick, children}) => {

    return (
        <section>
            <Modal visible={show} width="500" height="150" effect="fadeInUp" onClickAway={onClick}>
                <div className='modal-background'>
                    {children}
                </div>
            </Modal>
        </section>
    );
};

export default AlertModal;