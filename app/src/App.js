import {Container, Row, Col} from 'react-bootstrap';

import Header from './components/Header'
import VendingMachine from './components/VendingMachine';

import drizzleOptions from "./drizzleOptions";
import { Drizzle } from "@drizzle/store";
import { DrizzleContext } from "@drizzle/react-plugin";

const drizzle = new Drizzle(drizzleOptions);

function App() {
  const MAX_COLUMNS = 4;

  return (
    <div className="App">
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const {drizzle, drizzleState, initialized} = drizzleContext;

            if(!initialized) {
              return "Loading...";
            }

            return (
              <>
              <Header drizzle={drizzle} drizzleState={drizzleState}/>
              <Container>
                <Row>
                  <Col><VendingMachine columns={MAX_COLUMNS} drizzle={drizzle} drizzleState={drizzleState}/></Col>
              </Row>
              </Container>
              </>
            )
          }}
          
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </div>
  );
}

export default App;
