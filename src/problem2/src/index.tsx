import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import { store } from './app/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <CssBaseline />
    <ToastContainer />
    <App />
  </Provider>
);
