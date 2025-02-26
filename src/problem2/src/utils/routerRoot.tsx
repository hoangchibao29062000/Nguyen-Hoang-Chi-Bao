import { createBrowserRouter } from 'react-router-dom';
import { NotFound } from 'components/Common';
import HomePage from 'features/Home/page/HomePage';


const routerRoot = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    index: true
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default routerRoot;
