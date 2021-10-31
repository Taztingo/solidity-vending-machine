import {Row, Col, Card, Button} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {newContextComponents} from "@drizzle/react-components";
import '../VendingMachine.css';

const {ContractForm} = newContextComponents;

const VendingMachine = ({columns, drizzle, drizzleState}) => {
    const [dataKey, setDataKey] = useState(null);

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
                                        <Card.Title>{col.name === "" ? "Empty" : col.name}</Card.Title>
                                        <Card.Subtitle>{drizzle.web3.utils.fromWei(col.price, 'ether')} Ether</Card.Subtitle>
                                        <Card.Text>
                                            {col.description}
                                        </Card.Text>
                                        <Card.Text>
                                            In Stock: {col.amount}
                                        </Card.Text>
                                        <Button variant={col.amount === 0 ? "primary" : "primary"} disabled={col.amount === 0}>Buy</Button>
                                    </Card.Body>
                                </Card>
                            </Col>);
                        })}
                    </Row>)
                }
            )}

            
            <Row>
                <Col>
                    <ContractForm className="text-center"
                    drizzle={drizzle}
                    contract="VendingMachine"
                    method="restock"
                    labels={["Name", "Description", "Price", "Amount", "Slot"]}
                    sendArgs={{gas: 200000}}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default VendingMachine
