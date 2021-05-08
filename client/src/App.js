import logo from './logo.svg';
import './App.css';
import { unlockAccount } from './api/web3'
import useAsync from './components/useAsync';

function App() {
  const { execute } = useAsync(unlockAccount) 

  async function connnectToMetamask() {
    const { error, data } = await execute(null)
    
    if(error) {
      console.error(error)
    }
     if (data) {
        console.log(data)
        
     }
  }

  

  return (

    <div className="App">
      <header className="App-header">

        <button onClick={ connnectToMetamask }>Connect to Metamask</button>
      </header>
    </div>
  );
}


export default App;
