import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImg from '../assets/logolandscape.png';
import { useUserContext } from '../context/UserContext';

// ============================================================
// KOMPONEN GELOMBANG BIRU (Konsisten seperti Login/Register)
// ============================================================
const BlueWave = () => (
    <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 220" className="w-full h-[180px]" preserveAspectRatio="none">
            <defs>
                <filter id="waveDropShadow">
                    <feDropShadow dx="0" dy="-8" stdDeviation="15" floodColor="#1D4ED8" floodOpacity="0.18" />
                </filter>
            </defs>
            <path
                fill="#3B82F6"
                filter="url(#waveDropShadow)"
                d="M0,160 C200,220 380,80 600,140 C820,200 1020,60 1200,120 C1320,160 1390,180 1440,170 L1440,220 L0,220 Z"
                opacity="0.35"
            />
            <path
                fill="#2563EB"
                d="M0,190 C180,140 360,220 540,180 C720,140 900,200 1080,160 C1200,130 1360,200 1440,190 L1440,220 L0,220 Z"
                opacity="0.5"
            />
        </svg>
    </div>
);

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function TambahUser() {
    const navigate = useNavigate();
    const { addUser, getHeads, getStaffs } = useUserContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Ambil data dari context
    const availableLeaders = getHeads();
    const availableStaffs = getStaffs();

    // ===== STATE FORM =====
    const [formData, setFormData] = useState({
        namaLengkap: '',
        userName: '',
        email: '',
        noTelepon: '',
        role: 'Staff IT' as 'Staff IT' | 'Head IT',
        joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    });

    const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [newUserName, setNewUserName] = useState('');

    // Session user dari localStorage
    const sessionRaw = localStorage.getItem('currentUser');
    const sessionUser = sessionRaw ? JSON.parse(sessionRaw) : { username: 'Admin', role: 'ADMIN' };

    // ===== HANDLERS =====
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, role: e.target.value as 'Staff IT' | 'Head IT' });
        setSelectedLeaderId('');
        setSelectedStaffIds([]);
    };

    const handleAddStaff = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const staffId = e.target.value;
        if (!staffId) return;
        if (!selectedStaffIds.includes(staffId)) {
            setSelectedStaffIds(prev => [...prev, staffId]);
        }
        e.target.value = '';
    };

    const handleRemoveStaff = (staffId: string) => {
        setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi: admin yang mendaftarkan user (bukan self-register)
        addUser({
            name: formData.namaLengkap,
            username: formData.userName,
            email: formData.email,
            phone: formData.noTelepon,
            role: formData.role,
            joinDate: formData.joinDate,
            staffIds: formData.role === 'Head IT' ? selectedStaffIds : [],
            leaderId: formData.role === 'Staff IT' ? (selectedLeaderId || null) : null,
        });

        setNewUserName(formData.namaLengkap);
        setShowSuccessPopup(true);

        // Reset form
        setFormData({ namaLengkap: '', userName: '', email: '', noTelepon: '', role: 'Staff IT', joinDate: new Date().toISOString().split('T')[0] });
        setSelectedLeaderId('');
        setSelectedStaffIds([]);

        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    return (
        <div className="flex h-screen bg-[#F0F6FF] font-sans overflow-hidden relative">

            {/* ================= SUCCESS POPUP ================= */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center border border-slate-100 min-w-[320px]">
                        <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mb-4 shadow-[0_10px_25px_rgba(34,197,94,0.4)]">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 text-center">Registrasi Berhasil!</h3>
                        <p className="text-sm font-bold text-slate-500 mt-2 text-center">
                            <span className="text-blue-600">{newUserName}</span> berhasil didaftarkan.
                        </p>
                        <p className="text-xs font-semibold text-slate-400 mt-1 text-center">Email & kredensial login telah dikirim (lihat console)</p>
                    </div>
                </div>
            )}

            {/* ================= SIDEBAR ================= */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1E40AF] shadow-2xl transition-all duration-300 ease-in-out flex flex-col relative z-20 shrink-0 border-r border-blue-500/30`}>
                {/* Toggle button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3.5 top-8 bg-white text-slate-800 rounded-full p-1.5 shadow-md hover:scale-110 hover:text-blue-600 transition-all z-30 border border-slate-100"
                >
                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Logo */}
                <div className="h-24 flex items-center justify-center border-b border-blue-500/30 mt-2 pb-4 px-3 overflow-hidden">
                    <div className={`flex items-center justify-start transition-all duration-300 ${isSidebarOpen ? 'w-full h-16' : 'w-12 h-12'}`}>
                        <img
                            src={LogoImg}
                            alt="Logo IT Helpdesk"
                            className={`transition-all duration-300 origin-left drop-shadow-md filter brightness-110 ${isSidebarOpen ? 'w-full h-full object-contain object-left scale-[2.9] ml-2' : 'h-full max-w-none object-cover object-left scale-[2.5] ml-1.5'}`}
                        />
                    </div>
                </div>

                {/* Menu Navigasi */}
                <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
                    {/* Dashboard Admin */}
                    <div
                        onClick={() => navigate('/dashboard-admin')}
                        className="flex items-center gap-3.5 text-blue-100/80 px-4 py-3 rounded-xl font-semibold cursor-pointer transition-all hover:bg-white/10 hover:text-white group"
                    >
                        <svg className="w-5 h-5 shrink-0 text-blue-200/80 group-hover:text-white group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className={`whitespace-nowrap text-[13px] uppercase tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 -translate-x-4 hidden'}`}>Dashboard Karyawan</span>
                    </div>

                    {/* Tambah User (AKTIF) */}
                    <div className="flex items-center gap-3.5 bg-white/20 text-white border-l-[3.5px] border-white px-4 py-3 rounded-xl font-bold cursor-pointer">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className={`whitespace-nowrap text-[13px] uppercase tracking-wide transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 -translate-x-4 hidden'}`}>Tambah User</span>
                    </div>
                </div>

                {/* Profile di sidebar */}
                <div className="px-3 pb-6">
                    <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3 border border-white/20">
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                            <span className="text-[#3B82F6] font-black text-sm">{sessionUser.username?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        {isSidebarOpen && (
                            <div>
                                <p className="text-white font-black text-xs leading-tight">{sessionUser.username}</p>
                                <p className="text-blue-200 text-[10px] font-bold mt-0.5">Admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= KONTEN UTAMA ================= */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Gelombang biru di bagian bawah */}
                <BlueWave />

                {/* Header Bar Biru (Konsisten seperti DetailTiket) */}
                <div className="w-full px-6 pt-6 pb-2 z-10 shrink-0">
                    <div className="bg-[#3B82F6] rounded-[24px] px-8 py-3.5 flex items-center justify-between shadow-[0_10px_30px_rgba(59,130,246,0.35)]">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate('/dashboard-admin')}
                                className="text-blue-100 hover:text-white font-bold text-[14px] transition-colors"
                            >
                                Dashboard
                            </button>
                            <div className="bg-white px-5 py-1.5 rounded-full shadow-sm">
                                <span className="text-[#1E40AF] font-black text-[14px] tracking-wide">Tambah User</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <h3 className="text-white font-black text-[15px] leading-tight">{sessionUser.username}</h3>
                                <p className="text-blue-100 font-bold text-[11px]">Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg">
                                <span className="text-white font-black text-sm">{sessionUser.username?.charAt(0)?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Konten Form Scroll */}
                <div className="flex-1 overflow-y-auto px-6 py-4 z-10 relative">
                    <div className="max-w-[860px] mx-auto">

                        {/* Judul Halaman */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-[#3B82F6] rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-[26px] font-black text-[#1E3A8A] leading-tight">Registrasi Karyawan</h1>
                                <p className="text-slate-400 font-bold text-[13px]">Isi data berikut untuk mendaftarkan karyawan baru. Email & password otomatis akan dikirim.</p>
                            </div>
                        </div>

                        {/* Info Admin Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 flex items-center gap-3 mb-6">
                            <svg className="w-5 h-5 text-[#3B82F6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[#1E40AF] font-bold text-[13px]">
                                Password default: <span className="font-black bg-blue-100 px-2 py-0.5 rounded-lg">password123</span> — akan dikirim ke email karyawan secara otomatis.
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-[36px] shadow-[0_20px_60px_rgba(59,130,246,0.08)] border border-blue-100/80 p-10 mb-8">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                                {/* ======== KOLOM KIRI: Data Karyawan ======== */}
                                <div className="space-y-5">
                                    <h3 className="text-[12px] font-black text-[#3B82F6] uppercase tracking-widest border-b border-blue-100 pb-2">Data Karyawan</h3>

                                    {/* Nama Lengkap */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Nama Lengkap *</label>
                                        <input
                                            type="text"
                                            value={formData.namaLengkap}
                                            onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                                            placeholder="cth: Ariana Azzahra"
                                            required
                                            className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    {/* User Name */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">User Name *</label>
                                        <input
                                            type="text"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            placeholder="cth: Ariana.17200"
                                            required
                                            className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Alamat Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="cth: ariana@gmail.com"
                                            required
                                            className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    {/* No Telepon */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">No Telepon *</label>
                                        <input
                                            type="tel"
                                            value={formData.noTelepon}
                                            onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
                                            placeholder="cth: 081234567890"
                                            required
                                            className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    {/* Tanggal Bergabung */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Tanggal Bergabung *</label>
                                        <input
                                            type="date"
                                            value={formData.joinDate}
                                            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                            required
                                            className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Role *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.role}
                                                onChange={handleRoleChange}
                                                className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none appearance-none cursor-pointer focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                            >
                                                <option value="Staff IT">Staff IT</option>
                                                <option value="Head IT">Head IT</option>
                                            </select>
                                            <svg className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {/* Badge Role */}
                                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${formData.role === 'Head IT' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {formData.role}
                                        </div>
                                    </div>
                                </div>

                                {/* ======== KOLOM KANAN: Relasi Dinamis ======== */}
                                <div className="space-y-5">
                                    <h3 className="text-[12px] font-black text-[#3B82F6] uppercase tracking-widest border-b border-blue-100 pb-2">
                                        {formData.role === 'Staff IT' ? 'Pilih Leader' : 'Pilih Staff Anggota'}
                                    </h3>

                                    {/* ==== KONDISI 1: Staff IT → Pilih Leader (Single Select) ==== */}
                                    {formData.role === 'Staff IT' && (
                                        <div className="space-y-4">
                                            <p className="text-[12px] text-slate-400 font-bold">
                                                Staff IT harus memiliki 1 Leader (Head IT) yang bertanggung jawab.
                                            </p>
                                            <div>
                                                <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Pilih Leader *</label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedLeaderId}
                                                        onChange={(e) => setSelectedLeaderId(e.target.value)}
                                                        className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none appearance-none cursor-pointer focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                                    >
                                                        <option value="">— Pilih Head IT —</option>
                                                        {availableLeaders.map(l => (
                                                            <option key={l.id} value={l.id}>{l.name}</option>
                                                        ))}
                                                    </select>
                                                    <svg className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Preview Leader yang dipilih */}
                                            {selectedLeaderId && (() => {
                                                const leader = availableLeaders.find(l => l.id === selectedLeaderId);
                                                return leader ? (
                                                    <div>
                                                        <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Leader Terpilih</label>
                                                        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                                                                <img src={leader.avatar} alt="Leader" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-[#1E40AF] text-[14px]">{leader.name}</p>
                                                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Head IT</p>
                                                            </div>
                                                            <div className="ml-auto">
                                                                <div className="w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center">
                                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}

                                    {/* ==== KONDISI 2: Head IT → Multi-Select Staff ==== */}
                                    {formData.role === 'Head IT' && (
                                        <div className="space-y-4">
                                            <p className="text-[12px] text-slate-400 font-bold">
                                                Head IT dapat mengelola beberapa Staff IT. Tambahkan satu per satu dari daftar.
                                            </p>
                                            <div>
                                                <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">Tambah Staff</label>
                                                <div className="relative">
                                                    <select
                                                        onChange={handleAddStaff}
                                                        defaultValue=""
                                                        className="w-full bg-[#F8FAFF] border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 font-bold text-[14px] outline-none appearance-none cursor-pointer focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                                    >
                                                        <option value="" disabled>— Pilih Staff untuk ditambahkan —</option>
                                                        {availableStaffs
                                                            .filter(s => !selectedStaffIds.includes(s.id))
                                                            .map(s => (
                                                                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                                            ))}
                                                    </select>
                                                    <svg className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Daftar Staff Terpilih */}
                                            {selectedStaffIds.length > 0 ? (
                                                <div>
                                                    <label className="block text-[11px] font-black text-[#1E40AF] mb-1.5 ml-1">
                                                        Staff Anggota ({selectedStaffIds.length})
                                                    </label>
                                                    <div className="bg-[#F8FAFF] border border-blue-100 rounded-2xl p-3 flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                                                        {selectedStaffIds.map((staffId, idx) => {
                                                            const staff = availableStaffs.find(s => s.id === staffId);
                                                            return staff ? (
                                                                <div key={staffId} className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100 group">
                                                                    <span className="text-[#3B82F6] font-black text-xs w-5 text-center">{idx + 1}</span>
                                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                                                                        <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <span className="font-bold text-slate-700 text-[13px] flex-1 truncate">{staff.name}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveStaff(staffId)}
                                                                        className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-blue-50/50 border border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                                    <svg className="w-8 h-8 text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <p className="text-slate-400 font-bold text-[12px]">Belum ada staff terpilih</p>
                                                    <p className="text-slate-300 font-semibold text-[11px]">Pilih dari dropdown di atas</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ==== TOMBOL SUBMIT ==== */}
                                <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-[15px] py-4 rounded-2xl shadow-[0_8px_25px_rgba(34,197,94,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2.5"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Registrasi Karyawan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/dashboard-admin')}
                                        className="px-10 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[15px] py-4 rounded-2xl transition-all active:scale-95"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}