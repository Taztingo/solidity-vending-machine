import {Navbar, Container} from 'react-bootstrap';

const Header = ({drizzle, drizzleState}) => {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Vending Machine</Navbar.Brand>
                <div>Balance: {drizzle.web3.utils.fromWei(drizzleState.accountBalances[drizzleState.accounts[0]], 'ether')} Ether</div>
            </Container>
        />
        </Navbar>
    )
}

export default Header
