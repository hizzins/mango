import { createStore, compose, applyMiddleware } from 'redux';
import modules from './modules';
import thunk from 'redux-thunk';

const configure = () => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const composeEnhancers = devTools || compose;
  const store = createStore(modules, compose(applyMiddleware(thunk)));

  if (module.hot) {
    module.hot.accept('./modules', () => store.replaceReducer(modules));
  }

  return store;
}

export default configure;


