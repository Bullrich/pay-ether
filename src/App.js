import React, {Component} from 'react';
import './App.css';
import Alert from './components/Alert';
import Button from './components/Button';
import web3 from './web3';
import contract from './contract';
import AlertModal from "./components/AlertModal";

const MODAL_NO_METAMASK = 'no_metamask';
const MODAL_PAID = 'paid';

class App extends Component {
    state = {
        message: '',
        loading: false,
        status: '',
        peopleThatPayed: 0,
        modal: false
    };

    amountToPay = '0.01';
    alert = null;
    modalContent = '';


    scrollToBottom() {
        this.alert.scrollIntoView({behavior: 'smooth'});
    }

    async getHowManyPeoplePayed() {
        if (web3 != null) {
            try {
                const accounts = await web3.eth.getAccounts();
                console.log('Asking for people that payed on init from ' + accounts[0]);
                const peopleThatPayed = await contract.methods.findHowManyPeoplePayed().call({from: accounts[0]});
                console.log(peopleThatPayed);
                return peopleThatPayed;
            } catch (e) {
                console.error('Couldn\'t fetch how many people paid', e.message);
            }
            return null;
        }
    }

    displayError(error) {
        this.setState({message: error.message, status: '', loading: false});
        this.scrollToBottom();
    }

    displayModal(modal, amountThatPay) {
        let modalMessage;

        switch (modal) {
            case MODAL_NO_METAMASK:
                modalMessage = (<div>
                    <h3 className='Subtitle'>You need MetaMask to perform a transaction</h3>
                    You need it to interact with a Dapps.<br/>
                    Please, install it <a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>using
                    this link</a>
                </div>);
                break;
            case MODAL_PAID:
                modalMessage = (<h3 className='Subtitle'>{amountThatPay} people paid to see how many people paid!</h3>);
                break;
            default:
                throw Error('Incorrect modal parameter');
        }

        this.modalContent = modalMessage;
        this.setState({modal: true, message: '', loading: false});
    }

    async satisfyCuriosity() {
        if (this.state.loading)
            return;
        this.setState({
            message: 'Loading, operations take about 15 seconds to complete.',
            status: 'info',
            loading: true
        });
        if (web3 == null) {
            this.displayModal(MODAL_NO_METAMASK);
        } else {
            const peopleThatPayed = await this.getHowManyPeoplePayed();
            if (peopleThatPayed !== null)
                this.displayModal(MODAL_PAID, peopleThatPayed);
            else {
                const accounts = await web3.eth.getAccounts();
                this.scrollToBottom();
                try {
                    if (accounts.length === 0) {
                        this.setState({
                            message: 'You need to be logged inside Metamask',
                            status: 'error',
                            loading: false
                        });
                        this.scrollToBottom();
                        return;
                    }
                    this.setState({
                        message: 'Please wait. The operation takes about 15 seconds since it\'s accepted.',
                        status: 'info',
                        loading: true
                    });

                    await contract.methods.payToSatisfyCuriosity().send({
                        from: accounts[0],
                        value: web3.utils.toWei(this.amountToPay, 'ether'),
                        gas: '1000000'
                    });
                    const peopleThatPayed = await this.getHowManyPeoplePayed();
                    this.displayModal(MODAL_PAID, peopleThatPayed);
                } catch (e) {
                    console.error(e);
                    this.displayError(e);
                }
            }
        }
    }

    render() {
        return (
            <div>
                <AlertModal onClick={() => this.setState({modal: false})} show={this.state.modal}>
                    {this.modalContent}
                </AlertModal>
                <div className="App">
                    <h1 className={"Title"}>How many people paid {this.amountToPay} ether to see how many people
                        paid {this.amountToPay} ether?</h1>
                    <h3 className={"Subtitle"}>Curious?</h3>
                    <Button onClick={this.satisfyCuriosity.bind(this)} message={'Find out now'}
                            loading={this.state.loading}/>
                    <div ref={(el) => {
                        this.alert = el;
                    }}>
                        <Alert message={this.state.message} status={this.state.status}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
