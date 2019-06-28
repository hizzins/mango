import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';
import App from './App';
import store from 'store';

const Root = () => {
  return (
    <div>
      <HashRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </HashRouter>
    </div>
  )
}

export default hot(Root);
