import React from 'react';
import {Row, Col, Card, Button} from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import {useState, useEffect} from 'react';
import {newContextComponents} from "@drizzle/react-components";
import Web3 from 'web3';
import '../VendingMachine.css';

const {AccountData, ContractData, ContractForm } = newContextComponents;

const VendingMachine = ({columns, drizzle, drizzleState}) => {
    const [showRestock, setShowRestock] = useState(true);
    const [dataKey, setDataKey] = useState(null);
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        // Initialize web3
        let web = new Web3(Web3.currentProvider);
        setWeb3(web);
    }, [web3])

    useEffect(() => {
        // Declare this call to be cached and synchronized
        const contract = drizzle.contracts.VendingMachine;
        let dataKey = contract.methods["getItems"].cacheCall();
        setDataKey(dataKey);
    }, [dataKey, drizzle.contracts.VendingMachine]);

    // If display data exists then we can display the value
    const { VendingMachine } = drizzleState.contracts;
    const items = dataKey in VendingMachine.getItems ? VendingMachine.getItems[dataKey].value : [];

    return (
        <div className="VendingMachine">
            {[...Array(Math.ceil(items.length / columns)).keys()]
                .map(i => items.slice(i * columns, (i+1) * columns))
                .map(row => {
                    return (<Row className="VendingMachineRow">
                        {row.map(col => {
                            return (
                            <Col md={Math.ceil(12/columns)}>
                                <Card className="text-center">
                                    <Card.Body>
                                        <Card.Title>{col.name == "" ? "Empty" : col.name}</Card.Title>
                                        <Card.Subtitle>{web3 && web3.utils.fromWei(col.price, 'ether')} Ether</Card.Subtitle>
                                        <Card.Text>
                                            {col.description}
                                        </Card.Text>
                                        <Card.Text>
                                            In Stock: {col.amount}
                                        </Card.Text>
                                        <Button variant={col.amount == 0 ? "primary" : "primary"} disabled={col.amount == 0}>Buy</Button>
                                    </Card.Body>
                                </Card>
                            </Col>);
                        })}
                    </Row>)
                }
            )}
            <Row>
                <Col md={{ span: 2, offset: 5 }}>
                    <Button variant="success" onClick={() => setShowRestock(!showRestock)}><FaPlus/>{showRestock ? "Hide Restock" : "Show Restock"}</Button>
                </Col>
            </Row>

            {showRestock &&
                <Row>
                    <ContractForm
                    drizzle={drizzle}
                    contract="VendingMachine"
                    method="restock"
                    labels={["Name", "Description", "Price", "Amount", "Slot"]}
                    sendArgs={{gas: 200000}}
                    />
                </Row>
            }
        </div>
    )
}

export default VendingMachine
