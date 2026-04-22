import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ProjectProvider } from '@/lib/ProjectContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const ProtectedAppContent = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      
      {/* Dynamic routes for diagram editors */}
      <Route
        path="/diagrama-secuencia-editor/:id"
        element={
          <LayoutWrapper currentPageName="DiagramaSecuencia">
            <Pages.DiagramaSecuencia />
          </LayoutWrapper>
        }
      />
      <Route
        path="/diagrama-casos-uso-editor/:id"
        element={
          <LayoutWrapper currentPageName="DiagramaCasosUso">
            <Pages.DiagramaCasosUso />
          </LayoutWrapper>
        }
      />
      <Route
        path="/diagrama-clases-editor/:id"
        element={
          <LayoutWrapper currentPageName="DiagramaClases">
            <Pages.DiagramaClases />
          </LayoutWrapper>
        }
      />
      <Route
        path="/diagrama-paquetes-editor/:id"
        element={
          <LayoutWrapper currentPageName="DiagramaPaquetes">
            <Pages.DiagramaPaquetes />
          </LayoutWrapper>
        }
      />

      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/*" element={<ProtectedAppContent />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <ProjectProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
