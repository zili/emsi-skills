import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import Favorites from "./pages/favorites/Favorites";
import Portfolio from "./pages/Portfolio";
import ProjetRealise from "./pages/ProjetRealise";
import MyGigs from "./pages/myGigs/MyGigs";
import Candidature from "./pages/Candidature";
import ProjetRealisePage from "./pages/ProjetRealise";
import Projets from "./pages/projets/Projets";
import ProjetDetail from "./pages/projets/ProjetDetail";
import QueDashboard from "./pages/QueDashboard";
import AdminProjet from "./pages/AdminProjet";
import AdminComptes from "./pages/AdminComptes";
import AdminDemandes from "./pages/AdminDemandes";
import AdminGestionComptes from "./pages/AdminGestionComptes";

function App() {
  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/favoris",
          element: <Favorites />,
        },
        {
          path: "/portfolio",
          element: <Portfolio />,
        },
        {
          path: "/mygigs",
          element: <MyGigs />,
          children: [
            { path: "projetrealise", element: <ProjetRealise /> },
            { path: "candidature", element: <Candidature /> },
            { index: true, element: <ProjetRealise /> },
          ],
        },
        {
          path: "/candidature",
          element: <Candidature />,
        },
        {
          path: "/projetrealise",
          element: <ProjetRealise />,
        },
        {
          path: "/projets",
          element: <Projets />,
        },
        {
          path: "/projets/:id",
          element: <ProjetDetail />,
        },
        {
          path: "/admin",
          element: <QueDashboard />,
        },
        {
          path: "/dashboard", 
          element: <MyGigs />,
        },
        {
          path: "/admin-dashboard",
          element: <QueDashboard />,
        },
        {
          path: "/adminprojet",
          element: <AdminProjet />,
        },
        {
          path: "/admincomptes",
          element: <AdminComptes />,
        },
        {
          path: "/admindemandes",
          element: <AdminDemandes />,
        },
        {
          path: "/admin/gestion-comptes",
          element: <AdminGestionComptes />,
        },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
