// import './App.css';
import Form from './Form.tsx'
import { ChakraProvider } from '@chakra-ui/react';


function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <Form />
    </div>
    </ChakraProvider>
  );
}

export default App;
