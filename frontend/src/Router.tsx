import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { AdminpanelPage } from './pages/Adminpanel.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/logout',
    element: <HomePage />,
  },
  {
    path: '/adminpanel',
    element: <AdminpanelPage />,
  },
  
]);

export function Router() {
  return <RouterProvider router={router} />;
}
