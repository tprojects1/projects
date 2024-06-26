import React, { useState } from 'react';
import Routing from './Routing';
import { Orders } from './views';
import { Header } from '@projects/react-components';
import '@projects/styles';

const App = () => {

  const [headerText, setHeaderText] = useState();

  return (
    <>
      <Header text={headerText}></Header>
      <Routing
        defaultView={<Orders
          setHeaderText={setHeaderText} />}
      />
    </>
  );
};

export default App;
