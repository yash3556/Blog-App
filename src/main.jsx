import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import store from './Store/store.js'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'

import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import { Protected } from './components/'
import Signup from './Pages/Signup.jsx'
import AllPost from './Pages/AllPost.jsx'
import AddPost from './Pages/AddPost.jsx'
import EditPost from './Pages/EditPost.jsx'
import Post from './Pages/Post.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <Protected autentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: '/signup',
        element: (
          <Protected autentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: '/all-post',
        element: (
          <Protected autentication={true}>
            <AllPost />
          </Protected>
        ),
      },
      {
        path: '/add-post',
        element: (
          <Protected autentication={true}>
            <AddPost />
          </Protected>
        ),
      },
      {
        path: '/edit-post/:slug',
        element: (
          <Protected autentication={true}>
            <EditPost />
          </Protected>
        ),
      },
      {
        path: '/post/:slug',
        element: (
          <Protected autentication={true}>
            <Post />
          </Protected>
        ),
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
