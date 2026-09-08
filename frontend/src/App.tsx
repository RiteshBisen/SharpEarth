import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalysisProvider } from '@/context/AnalysisContext';
import { LandingPage } from '@/pages/LandingPage';
import { AppShell } from '@/components/layout/AppShell';
import { OverviewPage } from '@/pages/OverviewPage';
import { NewAnalysisPage } from '@/pages/NewAnalysisPage';
import { ResultsWorkspacePage } from '@/pages/ResultsWorkspacePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { DatasetsPage } from '@/pages/DatasetsPage';
import { ValidationPage } from '@/pages/ValidationPage';
import { SettingsPage } from '@/pages/SettingsPage';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalysisProvider>
        <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Application Shell Workspace */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="new-analysis" element={<NewAnalysisPage />} />
            <Route path="results" element={<ResultsWorkspacePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="datasets" element={<DatasetsPage />} />
            <Route path="validation" element={<ValidationPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="docs" element={<Navigate to="/app/overview" replace />} />
            <Route path="api" element={<Navigate to="/app/overview" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AnalysisProvider>
  </QueryClientProvider>
);
};
