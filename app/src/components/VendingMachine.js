import {Row, Col, Card, Button} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import {newContextComponents} from "@drizzle/react-components";
import {FaEthereum} from "react-icons/fa"
import '../VendingMachine.css';

const {ContractForm} = newContextComponents;

const VendingMachine = ({columns, drizzle, drizzleState}) => {
    const [dataKey, setDataKey] = useState(null);
    const [stackID, setStackID] = useState(null);
    const [ownerKey, setOwnerKey] = useState(null);

        // If display data exists then we can display the value
    const { VendingMachine } = drizzleState.contracts;
    const items = dataKey in VendingMachine.getItems ? VendingMachine.getItems[dataKey].value : [];
    const owner = ownerKey in VendingMachine.owner ? VendingMachine.owner[ownerKey].value : "";

    useEffect(() => {
        // Declare this call to be cached and synchronized
        const contract = drizzle.contracts.VendingMachine;
        let ownerKey = contract.methods["owner"].cacheCall();
        setOwnerKey(ownerKey);
    }, [ownerKey, drizzle.contracts.VendingMachine]);

    useEffect(() => {
        // Declare this call to be cached and synchronized
        const contract = drizzle.contracts.VendingMachine;
        let dataKey = contract.methods["getItems"].cacheCall();
        setDataKey(dataKey);
    }, [dataKey, drizzle.contracts.VendingMachine]);

    const buyItem = (row, column) => {
        let slot = (row * columns) + column;
        let item = items[slot];
        const contract = drizzle.contracts.VendingMachine;
        const stackId = contract.methods["buy"].cacheSend(slot, {
            value: item.price,
            from: drizzleState.accounts[0]
        });
        setStackID(stackId);
    };

    const renderRow = (row, rowIndex) => {
        return (
            <Row className="VendingMachineRow" key={`vending-machine-row-${rowIndex}`}>
                {row.map((item, columnIndex) => renderCell(item, rowIndex, columnIndex))}
            </Row>
        );
    };

    const renderCell = (item, rowIndex, columnIndex) => {
        return (
            <Col md={Math.ceil(12/columns)} key={`vending-machine-row-${rowIndex}-col-${columnIndex}`}>
                <Card className="text-center" border="secondary" bg={item.amount == 0 ? "light" : "light"}>
                    <Card.Body>
                        <Card.Title>{item.name === "" ? "Empty" : item.name}</Card.Title>
                        <Card.Subtitle>{parseFloat(drizzle.web3.utils.fromWei(item.price, 'ether')).toFixed(4)} <FaEthereum/> </Card.Subtitle>
                        <Card.Text>
                            {item.description}
                        </Card.Text>
                        <Card.Text>
                            In Stock: {item.amount}
                        </Card.Text>
                        <Button onClick={() => buyItem(rowIndex, columnIndex)} variant={item.amount == 0 ? "secondary" : "primary"} disabled={item.amount == 0}>Buy</Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    return (
        <div className="VendingMachine">
            {items && [...Array(Math.ceil(items.length / columns)).keys()]
                .map(i => items.slice(i * columns, (i+1) * columns))
                .map((row, rowIndex) => renderRow(row, rowIndex))
            }

            {owner == drizzleState.accounts[0] &&
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
            }
        </div>
    )
}

export default VendingMachine
