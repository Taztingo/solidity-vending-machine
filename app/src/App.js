import Header from './components/Header'
import VendingMachine from './components/VendingMachine'
import {Container, Row, Col} from 'react-bootstrap';
import {useState} from 'react';
import drizzleOptions from "./drizzleOptions";
import { Drizzle } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";

const drizzle = new Drizzle(drizzleOptions);

function App() {
  const [isOwner, setOwner] = useState(false);
  const MAX_COLUMNS = 4;

  return (
    <div className="App">
        <Header isOwner={isOwner}/>
        <Container>
          <Row>
            <Col>
              <DrizzleContext.Provider drizzle={drizzle}>
                <DrizzleContext.Consumer>
                  {drizzleContext => {
                    const {drizzle, drizzleState, initialized} = drizzleContext;

                    if(!initialized) {
                      return "Loading...";
                    }

                    return (
                      <VendingMachine columns={MAX_COLUMNS} drizzle={drizzle} drizzleState={drizzleState}/>
                    )
                  }}
                  
                </DrizzleContext.Consumer>
              </DrizzleContext.Provider>
            </Col>
          </Row>
        </Container>
    </div>
  );
}

export default App;
