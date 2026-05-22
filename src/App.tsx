import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardHead from './pages/DashboardHead';
import DashboardAdmin from './pages/DashboardAdmin';
import BuatTiket from './pages/BuatTiket';
import Teknisi from './pages/Teknisi';
import DetailTiket from './pages/DetailTiket';
import LihatTiket from './pages/LihatTiket';
import TambahUser from './pages/TambahUser';
import DashboardStaff from './pages/DashboardStaff';

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rute Halaman Utama */}
                <Route path="/" element={<LandingPage />} />

                {/* Rute Autentikasi — Register dihapus, hanya Admin yang bisa tambah user */}
                <Route path="/login" element={<Login />} />
                {/* Jika ada yang coba akses /register, redirect ke /login */}
                <Route path="/register" element={<Navigate to="/login" replace />} />

                {/* Rute Dashboard */}
                <Route path="/dashboard" element={<DashboardHead />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                <Route path="/dashboard-staff" element={<DashboardStaff />} />

                {/* Rute Fitur Tiket & Teknisi */}
                <Route path="/buat-tiket" element={<BuatTiket />} />
                <Route path="/teknisi" element={<Teknisi />} />
                <Route path="/lihat-tiket" element={<LihatTiket />} />
                <Route path="/ticket-detail" element={<DetailTiket />} />

                {/* Rute Manajemen User — Khusus Admin */}
                <Route path="/tambah-user" element={<TambahUser />} />
            </Routes>
        </Router>
    );
}