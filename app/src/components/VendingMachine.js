import React from 'react';
import {useState} from 'react';
import {Row, Col, Card} from 'react-bootstrap';

const VendingMachine = ({items, columns}) => {
    return (
        <div className="VendingMachine">
            {[...Array(Math.ceil(items.length / columns)).keys()]
                .map(i => items.slice(i * columns, (i+1) * columns))
                .map(row => {
                    return (<Row>
                        {row.map(col => {
                            return (
                            <Col md={Math.ceil(12/columns)}>
                                <Card>
                                    <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text>
                                        This is a longer card with supporting text below as a natural
                                        lead-in to additional content. This content is a little bit longer.
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>);
                        })}
                    </Row>)
                }
            )}
        </div>
    )
}

export default VendingMachine
