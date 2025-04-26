import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/extras/Layout.jsx';
import Home from "./components/home.jsx";
import './App.css'
import Login from "./components/auth/login.jsx";
import Register from "./components/auth/register.jsx";
import Faq from "./components/faq.jsx"
import Prediction from "./components/prediction.jsx";
import About from "./components/about.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AdminRoute from './components/auth/AdminRoute';
import AdminPanel from "./components/admin/AdminPanel";

const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/faq",
        element: (
          <ProtectedRoute>
            <Faq />
          </ProtectedRoute>
        )
      },
      {
        path: "/predictor",
        element: (
          <ProtectedRoute>
            <Prediction />
          </ProtectedRoute>
        )
      },
      {
        path: "/about",
        element: (
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        )
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          </ProtectedRoute>
        )
      }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
