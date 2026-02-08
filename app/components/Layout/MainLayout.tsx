import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

const MainLayout: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        return localStorage.getItem('condo_theme') === 'dark';
    });

    // Theme toggle logic (moved/accessing similar logic as before)
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('condo_theme', newTheme ? 'dark' : 'light');
    };

    // Sync theme class on mount/change
    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // If not logged in, we shouldn't be here (Protected Route handles this, but safe to check)
    if (!currentUser) return null;

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className="min-h-screen flex flex-col md:flex-row bg-neutral-surface dark:bg-brand-1 transition-colors duration-300">
                <Sidebar
                    activeTab={window.location.pathname.substring(1) || 'dashboard'}
                    setActiveTab={() => { }} // No-op, handled by Router
                    user={currentUser}
                    onLogout={logout}
                />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Navbar
                        user={currentUser}
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                        notifications={[]} // connect to real notifications later
                    />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        <div className="max-w-6xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
