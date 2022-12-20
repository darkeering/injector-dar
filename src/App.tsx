import React from 'react';
import logo from './logo.svg';
import './App.css';
import "reflect-metadata";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;


const Injectable1 = (): ClassDecorator => (target) => {};

class OtherService {
  a = 1;
}

@Injectable1()
class TestService {
  constructor(public readonly otherService: OtherService) {}

  testMethod() {
    console.log(this.otherService.a);
  }
}

const Factory1 = (target: any) => {
  // 获取所有注入的服务
  const providers = Reflect.getMetadata("design:paramtypes", target); // [OtherService]
  const args = providers.map((provider: any) => new provider());
  return new target(...args);
};

Factory1(TestService).testMethod(); // 1