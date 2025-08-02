import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ViewTicket from './pages/view-ticket';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import UserProfile from './pages/user-profile';
import CreateTicketPage from './pages/create-ticket';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CreateTicketPage />} />
        <Route path="/view-ticket" element={<ViewTicket />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
