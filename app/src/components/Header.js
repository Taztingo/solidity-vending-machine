import {Navbar, Container, Button} from 'react-bootstrap';
import {FaEthereum} from "react-icons/fa"
import {useState, useEffect} from 'react';

const Header = ({drizzle, drizzleState}) => {
    const [dataKey, setDataKey] = useState(null);

    // If display data exists then we can display the value
    const { VendingMachine } = drizzleState.contracts;
    const owner = dataKey in VendingMachine.owner ? VendingMachine.owner[dataKey].value : "";

    useEffect(() => {
        // Declare this call to be cached and synchronized
        const contract = drizzle.contracts.VendingMachine;
        let dataKey = contract.methods["owner"].cacheCall();
        setDataKey(dataKey);
    }, [dataKey, drizzle.contracts.VendingMachine]);

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Vending Machine</Navbar.Brand>
                {owner == drizzleState.accounts[0] && <Button variant="success">Withdraw</Button>}
                {drizzleState.accountBalances[drizzleState.accounts[0]] && <div>Spend Balance: {parseFloat(drizzle.web3.utils.fromWei(drizzleState.accountBalances[drizzleState.accounts[0]], 'ether')).toFixed(4)} <FaEthereum/></div>}
            </Container>
        </Navbar>
    );

}

export default Header
