import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/layouts/Layout'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import HomePage from '../features/home/pages/HomePage'
import AvatarUploadPage from '../features/onboarding/pages/AvatarUploadPage'
import ArtistProfilePage from '../features/onboarding/pages/ArtistProfilePage'
import ArtistImagePage from '../features/onboarding/pages/ArtistImagePage'
import BandMembersPage from '../features/onboarding/pages/BandMembersPage'
import LegalAcceptancePage from '../features/onboarding/pages/LegalAcceptancePage'
import RequireAuth from '../features/auth/components/RequireAuth'
import DashboardPage from '../features/dashboard/DashboardPage'
import PortfolioPage from '../features/portfolio/pages/PortfolioPage'
import CreateAlbumPage from '../features/portfolio/pages/CreateAlbumPage'
import MusicPage from '../features/music/pages/MusicPage'
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage'
import ProfilePage from '../features/profile/pages/ProfilePage'
import SettingsPage from '../features/settings/pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/onboarding/avatar',
    element: (
      <RequireAuth>
        <AvatarUploadPage />
      </RequireAuth>
    )
  },
  {
    path: '/onboarding/artist-profile',
    element: (
      <RequireAuth>
        <ArtistProfilePage />
      </RequireAuth>
    )
  },
  {
    path: '/onboarding/artist-image',
    element: (
      <RequireAuth>
        <ArtistImagePage />
      </RequireAuth>
    )
  },
  {
    path: '/onboarding/band-members',
    element: (
      <RequireAuth>
        <BandMembersPage />
      </RequireAuth>
    )
  },
  {
    path: '/onboarding/legal',
    element: (
      <RequireAuth>
        <LegalAcceptancePage />
      </RequireAuth>
    )
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />
      },
      {
        path: 'portfolio/create-album',
        element: <CreateAlbumPage />
      },
      {
        path: 'music',
        element: <MusicPage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
])

export default router
