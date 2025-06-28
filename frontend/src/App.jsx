import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import AuthRedirect from "./components/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute";
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
import PortfolioView from "./pages/PortfolioView";
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
// Import dynamique pour éviter les problèmes de cache
import { lazy, Suspense } from 'react';
const AdminProjetDetail = lazy(() => import("./pages/AdminProjetDetail"));
import AccueilStaffClub from "./pages/AccueilStaffClub";
import Demandes from "./pages/Demandes";
import Profil from "./pages/Profil";

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
          element: <Navigate to="/accueil-student" replace />,
        },
        {
          path: "/accueil-student",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/accueil-staff-club",
          element: (
            <ProtectedRoute>
              <AccueilStaffClub />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gigs",
          element: (
            <ProtectedRoute>
              <Gigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          ),
        },
        {
          path: "/message/:id",
          element: (
            <ProtectedRoute>
              <Message />
            </ProtectedRoute>
          ),
        },
        {
          path: "/add",
          element: (
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          ),
        },
        {
          path: "/add-project",
          element: (
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gig/:id",
          element: (
            <ProtectedRoute>
              <Gig />
            </ProtectedRoute>
          ),
        },
        {
          path: "/favoris",
          element: (
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          ),
        },
        {
          path: "/portfolio",
          element: (
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          ),
        },
        {
          path: "/portfolio-view",
          element: (
            <ProtectedRoute>
              <PortfolioView />
            </ProtectedRoute>
          ),
        },
        {
          path: "/mygigs",
          element: (
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          ),
          children: [
            { path: "projetrealise", element: <ProjetRealise /> },
            { path: "candidature", element: <Candidature /> },
            { index: true, element: <ProjetRealise /> },
          ],
        },
        {
          path: "/candidature",
          element: (
            <ProtectedRoute>
              <Candidature />
            </ProtectedRoute>
          ),
        },
        {
          path: "/projetrealise",
          element: (
            <ProtectedRoute>
              <ProjetRealise />
            </ProtectedRoute>
          ),
        },
        {
          path: "/projets",
          element: (
            <ProtectedRoute>
              <Projets />
            </ProtectedRoute>
          ),
        },
        {
          path: "/projets/:id",
          element: (
            <ProtectedRoute>
              <ProjetDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "/demandes",
          element: (
            <ProtectedRoute>
              <Demandes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profil",
          element: (
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <QueDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard", 
          element: (
            <ProtectedRoute>
              <MyGigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-dashboard",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <QueDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/adminprojet",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminProjet />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admincomptes",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminComptes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admindemandes",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminDemandes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/gestion-comptes",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <AdminGestionComptes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/projet/:id",
          element: (
            <ProtectedRoute requireAdmin={true}>
              <Suspense fallback={<div>Chargement...</div>}>
                <AdminProjetDetail />
              </Suspense>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/register",
      element: (
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      ),
    },
    {
      path: "/login",
      element: (
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
