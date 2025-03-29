import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { AdminPanelPage } from './pages/AdminPanel.page';
import {ClassroomPanelPage} from "@/pages/ClassroomPanel.page";

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
    element: <AdminPanelPage />,
  },
  {
    path: '/classroom-panel',
    element: <ClassroomPanelPage/>
  }
  
]);

export function Router() {
  return <RouterProvider router={router} />;
}
