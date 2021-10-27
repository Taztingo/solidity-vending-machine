import Header from './components/Header'
import VendingMachine from './components/VendingMachine'
import {Container, Row, Col} from 'react-bootstrap';
import {useState} from 'react';

function App() {
  const [isOwner, setOwner] = useState(false);
  const [items, setItems] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13
  ]);
  const MAX_COLUMNS = 4;

  return (
    <div className="App">
        <Header isOwner={isOwner}/>
        <Container>
          <Row>
            <Col><VendingMachine items={items} columns={MAX_COLUMNS}/></Col>
          </Row>
        </Container>
    </div>
  );
}

export default App;
