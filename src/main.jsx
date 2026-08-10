// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App          from './App.jsx';
import Home         from './pages/Home.jsx';
import Events       from './pages/Events.jsx';
import EventDetail  from './pages/EventDetail.jsx';
import TechTalks    from './pages/TechTalks.jsx';
import Register     from './pages/Register.jsx';
import Sponsors     from './pages/Sponsors.jsx';
import Team         from './pages/Team.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,           element: <Home />        },
      { path: 'events',        element: <Events />       },
      { path: 'events/:id',    element: <EventDetail />  },
      { path: 'tech-talks',    element: <TechTalks />    },
      { path: 'register',      element: <Register />     },
      { path: 'sponsors',      element: <Sponsors />     },
      { path: 'team',          element: <Team />         },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
