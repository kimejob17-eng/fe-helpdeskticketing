import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export default function DashboardStaff() {
    const navigate = useNavigate();
    const { users } = useUserContext();

    const [tickets, setTickets] = useState<any[]>([]);
    
    // Ambil data user yang sedang login dari localStorage
    const sessionRaw = localStorage.getItem('currentUser');
    const currentUser = sessionRaw ? JSON.parse(sessionRaw) : null;

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'STAFF_IT_LEADER') {
            // Jika tidak ada session atau bukan staf, kembalikan ke login
            navigate('/login');
            return;
        }

        // Load tiket
        const saved = localStorage.getItem('ticketsData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Filter tiket khusus untuk staf ini (berdasarkan nama)
                const myTickets = parsed.filter((t: any) => 
                    t.tech && currentUser.username && t.tech.toLowerCase().includes(currentUser.username.toLowerCase())
                );
                // Sort by ID ascending (seperti DashboardHead)
                setTickets(myTickets.sort((a: any, b: any) => Number(a.id) - Number(b.id)));
            } catch (e) {
                console.error(e);
            }
        }
    }, [currentUser, navigate]);

    // Cari avatar dari global users context
    const getMyAvatar = () => {
        if (!currentUser) return 'https://i.pravatar.cc/150?img=11';
        const me = users.find(u => u.name.toLowerCase() === currentUser.username.toLowerCase());
        return me?.avatar || 'https://i.pravatar.cc/150?img=11';
    };

    const handleSignOut = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    // Fungsi update status tiket (misal dari On Checking -> In Progress -> Recheck)
    const updateTicketStatus = (ticketId: string, newStatus: string) => {
        const allSaved = localStorage.getItem('ticketsData');
        if (allSaved) {
            let allTickets = JSON.parse(allSaved);
            allTickets = allTickets.map((t: any) => t.id === ticketId ? { ...t, status: newStatus } : t);
            localStorage.setItem('ticketsData', JSON.stringify(allTickets));
            
            // Perbarui state lokal halaman ini
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-[#22c55e] border-emerald-200';
            case 'Reopen': return 'bg-amber-50 text-[#f59e0b] border-amber-200';
            case 'In Progress': return 'bg-blue-50 text-[#3b82f6] border-blue-200';
            case 'Recheck': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'On Checking': return 'bg-rose-50 text-[#ef4444] border-rose-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-[#3B82F6] px-8 py-5 shadow-md flex justify-between items-center rounded-b-[32px] mx-4 mt-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
                        <img src={getMyAvatar()} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white font-black text-xl leading-tight">{currentUser?.username || 'Staff IT'}</p>
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Dashboard Teknisi</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 bg-blue-800/40 hover:bg-blue-800/80 px-4 py-2 rounded-full transition-colors border-2 border-blue-900/50 text-white"
                >
                    <span className="font-black text-[12px] uppercase">Sign Out</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>

            {/* Content Body */}
            <div className="px-8 py-8 flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Daftar Tugas Anda</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {tickets.length > 0 ? tickets.map(t => (
                            <div key={t.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
                                {/* Decor */}
                                <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${t.status === 'Completed' ? 'bg-emerald-500' : t.status === 'In Progress' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>

                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[15px] font-black text-[#1E40AF]">No Task {t.id}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(t.status)}`}>
                                                    {t.status}
                                                </span>
                                                {t.priority && (
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border border-transparent uppercase tracking-wider text-white ${t.priority.toUpperCase() === 'HIGH' ? 'bg-[#ef4444]' : t.priority.toUpperCase() === 'MEDIUM' ? 'bg-[#f59e0b]' : 'bg-[#22c55e]'}`}>
                                                        {t.priority}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{t.date}</p>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-[14px] font-bold text-slate-700 leading-relaxed">
                                            {t.kodeMasalah && <span className="text-rose-500 mr-1">[{t.kodeMasalah}]</span>}
                                            {t.task}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-slate-100 pt-5">
                                    {/* Action Buttons Based on Status */}
                                    {t.status === 'On Checking' || t.status === 'Reopen' ? (
                                        <button 
                                            onClick={() => updateTicketStatus(t.id, 'In Progress')}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl text-[14px] shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Start Penugasan
                                        </button>
                                    ) : t.status === 'In Progress' ? (
                                        <button 
                                            onClick={() => updateTicketStatus(t.id, 'Recheck')}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-2xl text-[14px] shadow-[0_4px_12px_rgba(147,51,234,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                            Ajukan Recheck ke Head IT
                                        </button>
                                    ) : t.status === 'Recheck' ? (
                                        <div className="w-full bg-purple-50 text-purple-600 border border-purple-200 font-black py-3 rounded-2xl text-[13px] flex items-center justify-center gap-2 cursor-default">
                                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                            Menunggu Pengecekan Head IT
                                        </div>
                                    ) : (
                                        <div className="w-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-black py-3 rounded-2xl text-[13px] flex items-center justify-center gap-2 cursor-default">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            Tugas Telah Selesai
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <p className="text-lg font-black text-slate-700">Tidak ada tugas saat ini</p>
                                <p className="text-sm font-bold text-slate-400 mt-1">Anda sudah menyelesaikan semua penugasan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
