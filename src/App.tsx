import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = lazy(() => import("./pages/Index.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const NewsPage = lazy(() => import("./pages/NewsPage.tsx"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage.tsx"));
const MembersPage = lazy(() => import("./pages/MembersPage.tsx"));
const ClustersPage = lazy(() => import("./pages/ClustersPage.tsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.tsx"));
const EventsPage = lazy(() => import("./pages/EventsPage.tsx"));
const CommitteesPage = lazy(() => import("./pages/CommitteesPage.tsx"));
const CommitteeDetailPage = lazy(() => import("./pages/CommitteeDetailPage.tsx"));
const DigitalCommitteeDetailPage = lazy(() => import("./pages/DigitalCommitteeDetailPage.tsx"));
const VideosPage = lazy(() => import("./pages/VideosPage.tsx"));
const AdminRedirectPage = lazy(() => import("./pages/AdminRedirectPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const RouteLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-background text-foreground"
    role="status"
    aria-live="polite"
  >
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin border-2 border-border border-t-primary" />
      <div className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Загрузка страницы
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/clusters" element={<ClustersPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/committees" element={<CommitteesPage />} />
            <Route path="/committees/digital-ai" element={<DigitalCommitteeDetailPage />} />
            <Route path="/committees/:committeeId" element={<CommitteeDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/admin/*" element={<AdminRedirectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
