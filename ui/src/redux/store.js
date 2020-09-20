import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default function configureStore() {
 return createStore(
    rootReducer,
   //  composeWithDevTools(applyMiddleware(thunk)),
   compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
   )
 );
}