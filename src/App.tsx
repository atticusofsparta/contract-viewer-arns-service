import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import {Layout, NotFound} from './components/layout'
import { Home } from './components/Pages';


const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout/>} errorElement={<NotFound/>}>
    <Route index element={<Home/>} path='/' />

  </Route>
));

function App() {

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
