import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home.jsx"; // ✅ Default import
import './App.css'
import Login from "./components/auth/login.jsx";
import Register from "./components/auth/register.jsx";
import Faq from "./components/faq.jsx"
import Prediction from "./components/prediction.jsx";
import Consultation from "./components/consultation.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/login",
    element: <Login />
  },
  {
    path:"/register",
    element: <Register />
  },
  {
    path: "/faq",
    element: <Faq />
  },
  {
    path: "/predictor",
    element: <Prediction />
  },
  {
    path: "/consultation",
    element: <Consultation />
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
