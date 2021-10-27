import React from 'react'
import {useState} from 'react'
import {Navbar, Container, Nav, Form, Button, FormControl, Input} from 'react-bootstrap'

const Header = ({isOwner}) => {
    const [balance, setBalance] = useState(0.00);

    console.log(isOwner);

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Vending Machine</Navbar.Brand>

                {isOwner 
                    ? <div>Ether blah: {balance}</div>
                    : <Form className="d-flex">
                        <FormControl type="text" placeholder="Username" className="me-2" aria-label="Username"/>
                        <FormControl type="password" placeholder="Password" className="me-2" aria-label="Password"/>
                        <Button variant="dark">Login</Button>
                    </Form>
                }
            </Container>

            
        </Navbar>
    )
}

export default Header
