import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { User, UserRole } from './types'; // Removed unused imports
import { MOCK_CLIENTS, MOCK_POLLS, MOCK_ANNOUNCEMENTS, MOCK_TASKS } from './constants';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Login';

// Components (imported directly or kept if they don't need props drilled from here anymore 
// - ideally they should fetch their own data or use a DataContext, but for MVP refactor we'll keep props or adapt)
import Dashboard from './components/Dashboard';
import GatehouseView from './components/GatehouseView';
import PollsView from './components/PollsView';
import BoardView from './components/BoardView';
import OperationalView from './components/OperationalView';
import ManagementView from './components/ManagementView';
import DocumentsView from './components/DocumentsView';
import { useState } from 'react';
import BillingView from './components/BillingView';


// Wrapper to handle conditional rendering and data passing until we move data to Context/API
const AppRoutes = () => {
  const { currentUser, isAuthenticated, loginWithUser, users } = useAuth();

  // STATE MANAGEMENT (Moved from App.tsx but still needed for passing props)
  // In a real app, these would be in a DataContext or fetched in the pages.
  // We keep them here to minimize changes to child components for now.
  const [polls, setPolls] = useState(MOCK_POLLS);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [documents, setDocuments] = useState<any[]>([]); // Typed as any[] temporarily to match existing empty state
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [appUsers, setAppUsers] = useState(users); // Using users from context initially or managing local state

  if (!isAuthenticated) {
    return <Login onLogin={loginWithUser} users={users} />;
  }

  const isMasterAdmin = currentUser?.id === 'admin-fluxibi';

  // DATA FILTERING
  const filteredPolls = isMasterAdmin ? polls : polls.filter(p => p.clientId === currentUser?.clientId);
  const filteredAnnouncements = isMasterAdmin ? announcements : announcements.filter(a => a.clientId === currentUser?.clientId);
  const filteredTasks = isMasterAdmin ? tasks : tasks.filter(t => t.clientId === currentUser?.clientId);
  const filteredDocuments = isMasterAdmin ? documents : documents.filter(d => d.clientId === currentUser?.clientId);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={
          <Dashboard
            user={currentUser!}
            polls={filteredPolls}
            announcements={filteredAnnouncements}
            tasks={filteredTasks}
            notifications={[]} // connect notifications later
            onNavigate={() => { }} // Remove navigation prop dependency or mock it
          />
        } />

        <Route path="gatehouse" element={
          <GatehouseView
            user={currentUser!}
            onSendNotification={() => { }} // Implement later
          />
        } />

        <Route path="polls" element={
          <PollsView user={currentUser!} polls={filteredPolls} setPolls={setPolls} />
        } />

        <Route path="board" element={
          <BoardView user={currentUser!} announcements={filteredAnnouncements} setAnnouncements={setAnnouncements} />
        } />

        <Route path="operational" element={
          <OperationalView user={currentUser!} tasks={filteredTasks} setTasks={setTasks} />
        } />

        <Route path="documents" element={
          <DocumentsView user={currentUser!} documents={filteredDocuments} setDocuments={setDocuments} />
        } />

        <Route path="billing" element={
          <BillingView user={currentUser!} />
        } />

        <Route path="management" element={
          <ManagementView
            users={appUsers}
            setUsers={setAppUsers}
            clients={clients}
            setClients={setClients}
            currentUser={currentUser!}
          />
        } />
      </Route>
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
