import Header from './components/Header'
import VendingMachine from './components/VendingMachine'
import {Container, Row, Col} from 'react-bootstrap';
import {useState} from 'react';

function App() {
  const [isOwner, setOwner] = useState(false);

  return (
    <div className="App">
        <Header isOwner={isOwner}/>
        <Container>
          <Row>
            <Col><VendingMachine/></Col>
          </Row>
        </Container>
    </div>
  );
}

export default App;
