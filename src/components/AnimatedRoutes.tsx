import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import DashboardHead from '../pages/DashboardHead';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardStaff from '../pages/DashboardStaff';
import BuatTiket from '../pages/BuatTiket';
import Teknisi from '../pages/Teknisi';
import DetailTiket from '../pages/DetailTiket';
import LihatTiket from '../pages/LihatTiket';
import TambahUser from '../pages/TambahUser';
import Profile from '../pages/Profile';
import PageTransition from './PageTransition';

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<Navigate to="/login" replace />} />

                <Route path="/dashboard" element={<PageTransition><DashboardHead /></PageTransition>} />
                <Route path="/dashboard-admin" element={<PageTransition><DashboardAdmin /></PageTransition>} />
                <Route path="/dashboard-staff" element={<PageTransition><DashboardStaff /></PageTransition>} />

                <Route path="/buat-tiket" element={<PageTransition><BuatTiket /></PageTransition>} />
                <Route path="/teknisi" element={<PageTransition><Teknisi /></PageTransition>} />
                <Route path="/lihat-tiket" element={<PageTransition><LihatTiket /></PageTransition>} />
                <Route path="/ticket-detail" element={<PageTransition><DetailTiket /></PageTransition>} />

                <Route path="/tambah-user" element={<PageTransition><TambahUser /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
}
