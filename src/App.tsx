import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import {
  Address,
  Config,
  Contract,
  Docs,
  Home,
  Interaction,
} from './components/Pages';
import { Layout, NotFound } from './components/layout';

const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<Layout />} errorElement={<NotFound />}>
      <Route index element={<Home />} path="/" />
      <Route element={<Config />} path="/config" />
      <Route element={<Docs />} path="/docs" />
      <Route element={<NotFound />} path="*" />
      {/*  */}
      <Route element={<Address />} path="/address/:address" />
      <Route element={<Interaction />} path="/interaction/:interaction" />
      <Route element={<Contract />} path="/contract/:contract" />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
