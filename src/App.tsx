/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { AgentListingFormPage } from './pages/AgentListingFormPage';
import { SavedPropertiesPage } from './pages/SavedPropertiesPage';

function AppContent() {
  const { currentView, selectedPropertyId } = useProperties();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar />

      <main className="flex-1">
        {currentView === 'portal' && <HomePage />}
        {currentView === 'detail' && selectedPropertyId && (
          <PropertyDetailPage propertyId={selectedPropertyId} />
        )}
        {currentView === 'agent-dashboard' && <AgentDashboardPage />}
        {currentView === 'agent-new-listing' && <AgentListingFormPage />}
        {currentView === 'agent-edit-listing' && (
          <AgentListingFormPage editPropertyId={selectedPropertyId} />
        )}
        {currentView === 'saved' && <SavedPropertiesPage />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AppContent />
      </PropertyProvider>
    </AuthProvider>
  );
}
