import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';

// Временно отключаем другие маршруты и компоненты

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
