import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { store, persistor } from './store/store.js';
import { PersistGate } from "redux-persist/integration/react";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="bottom-right"
    />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>

    </Provider>
  </StrictMode>,
)
