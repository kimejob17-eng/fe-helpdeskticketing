import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export default function DetailTiket() {
    const navigate = useNavigate();
    const location = useLocation();

    const { users } = useUserContext();

    // ================= STATE & DATA =================
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Mengambil state dari navigasi LihatTiket (jika ada), jika tidak gunakan default
    const passedData = location.state as any;

    const [ticketData, setTicketData] = useState({
        noTask: passedData?.id || '005',
        teknisi: passedData?.tech || 'Fadlan Jamirudin',
        deadline: '2026-06-14', // Format YYYY-MM-DD
        kategori: passedData?.priority || 'HIGH',
        detailPesanan: passedData?.fullDetail || passedData?.task || 'Tidak ada detail pesanan.',
        dokumentasi: [
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500',
            'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500'
        ],
        avatar: passedData?.avatar || 'https://i.pravatar.cc/150?img=15'
    });

    // Update avatar berdasarkan teknisi yang dipilih dari context
    useEffect(() => {
        const staff = users.find(u => u.name === ticketData.teknisi);
        if (staff && staff.avatar) {
            setTicketData(prev => ({ ...prev, avatar: staff.avatar }));
        } else {
            // Fallback default jika tidak ada di context (misal staff dihapus)
            setTicketData(prev => ({ ...prev, avatar: 'https://i.pravatar.cc/150?img=11' }));
        }
    }, [ticketData.teknisi, users]);

    // ================= HANDLERS =================
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
            setIsEditing(false);
        }, 2000);
    };

    const handleComplete = () => {
        navigate('/lihat-tiket');
    };

    // ================= HELPERS =================
    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'LOW': return 'bg-[#22c55e] text-white border-transparent shadow-[0_4px_10px_rgba(34,197,94,0.3)]';
            case 'Medium': return 'bg-[#f59e0b] text-white border-transparent shadow-[0_4px_10px_rgba(245,158,11,0.3)]';
            case 'HIGH': return 'bg-[#ef4444] text-white border-transparent shadow-[0_4px_10px_rgba(239,68,68,0.3)]';
            default: return 'bg-slate-200 text-slate-600 border-transparent';
        }
    };

    const formatDateVisual = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-10 px-4 font-sans relative overflow-hidden">

            {/* ================= SUCCESS POPUP ================= */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center border border-slate-100 min-w-[320px] transform animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mb-4 shadow-[0_10px_25px_rgba(34,197,94,0.4)]">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 text-center">Tiket Diperbarui!</h3>
                        <p className="text-sm font-bold text-slate-500 mt-2 animate-pulse">Menyimpan perubahan...</p>
                    </div>
                </div>
            )}

            {/* ================= BLUE HEADER BLOCK ================= */}
            <div className="w-full max-w-[1100px] bg-[#3B82F6] rounded-[32px] shadow-[0_15px_30px_rgba(59,130,246,0.3)] flex flex-col px-8 py-5 mb-8 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8 ml-2">
                        <button onClick={() => navigate('/buat-tiket')} className="text-white hover:text-blue-200 font-bold text-[15px] transition-colors">Buat Tiket</button>
                        <div className="bg-white px-6 py-1.5 rounded-full shadow-sm">
                            <span className="text-[#1E40AF] font-black text-[15px] tracking-wide">Detail Tiket</span>
                        </div>
                        <button onClick={() => navigate('/lihat-tiket')} className="text-white hover:text-blue-200 font-bold text-[15px] transition-colors">Lihat Tiket</button>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 bg-blue-800/40 hover:bg-blue-800/80 px-4 py-1.5 rounded-full transition-colors border-2 border-blue-900/50">
                        <div className="bg-white rounded-full p-0.5">
                            <svg className="w-3.5 h-3.5 text-blue-900" fill="currentColor" viewBox="0 0 24 24"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                        </div>
                        <span className="text-white font-black text-[11px] tracking-wider uppercase">Home</span>
                    </button>
                </div>
            </div>

            {/* ================= MAIN CONTENT CARD ================= */}
            <div className="w-full max-w-[1100px] bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 min-h-[500px]">

                {isEditing ? (
                    /* ================= MODE EDIT TIKET ================= */
                    <form onSubmit={handleSaveEdit} className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[900px] mx-auto">

                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-5">
                            <div className="bg-[#f59e0b]/10 p-3 rounded-2xl text-[#f59e0b] shadow-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Tiket (Reopen)</h2>
                                <p className="text-[13px] font-bold text-slate-400 mt-1">Perbarui detail tugas dan prioritas perbaikan.</p>
                            </div>
                        </div>

                        {/* Area Input Edit yang Presisi */}
                        <div className="bg-[#f8fafc] border border-slate-100 rounded-[32px] p-8 shadow-inner mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                                {/* Kolom Kiri */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">No Task</label>
                                        <input
                                            type="text"
                                            value={ticketData.noTask}
                                            onChange={(e) => setTicketData({ ...ticketData, noTask: e.target.value })}
                                            required
                                            readOnly
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-500 font-bold text-[14px] shadow-sm outline-none transition-all cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori / Priority</label>
                                        <div className="relative">
                                            <select
                                                value={ticketData.kategori}
                                                onChange={(e) => setTicketData({ ...ticketData, kategori: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold text-[14px] shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            >
                                                <option value="LOW">LOW</option>
                                                <option value="Medium">Medium</option>
                                                <option value="HIGH">HIGH</option>
                                            </select>
                                            <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deadline Perbaikan</label>
                                        <input
                                            type="date"
                                            value={ticketData.deadline}
                                            onChange={(e) => setTicketData({ ...ticketData, deadline: e.target.value })}
                                            required
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold text-[14px] shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Teknisi Ditugaskan</label>
                                        <div className="relative">
                                            <select
                                                value={ticketData.teknisi}
                                                onChange={(e) => setTicketData({ ...ticketData, teknisi: e.target.value })}
                                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold text-[14px] shadow-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                            >
                                                <option value="Fadlan Jamirudin">Fadlan Jamirudin</option>
                                                <option value="Laura Zaina">Laura Zaina</option>
                                                <option value="Febrian Anastesi">Febrian Anastesi</option>
                                            </select>
                                            <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Width Teks Area */}
                                <div className="col-span-1 md:col-span-2 mt-2">
                                    <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Detail Pesanan Kendala</label>
                                    <textarea
                                        value={ticketData.detailPesanan}
                                        onChange={(e) => setTicketData({ ...ticketData, detailPesanan: e.target.value })}
                                        rows={6}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-semibold text-[14px] shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Upload Image Area */}
                                <div className="col-span-1 md:col-span-2 mt-2">
                                    <label className="block text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Lampiran Dokumentasi</label>
                                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                        {ticketData.dokumentasi.map((img, i) => (
                                            <div key={i} className="w-[140px] h-[100px] shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group">
                                                <img src={img} alt={`Doc ${i}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setTicketData({ ...ticketData, dokumentasi: ticketData.dokumentasi.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 bg-white/90 text-rose-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-500 hover:text-white">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ))}
                                        <label className="w-[140px] h-[100px] shrink-0 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 cursor-pointer bg-white hover:bg-blue-50 hover:border-blue-400 hover:text-blue-500 transition-all">
                                            <input type="file" accept="image/*" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setTicketData({ ...ticketData, dokumentasi: [...ticketData.dokumentasi, URL.createObjectURL(file)] });
                                            }} className="hidden" />
                                            <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                            <span className="text-[11px] font-bold tracking-wide">Unggah Foto</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan & Batal */}
                        <div className="flex gap-4 w-full">
                            <button type="submit" className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black py-4 rounded-full text-[15px] shadow-[0_8px_20px_rgba(34,197,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                Pesan Tiket Kembali
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-12 bg-slate-200 hover:bg-slate-300 text-slate-600 font-black py-4 rounded-full text-[15px] transition-all active:scale-95">
                                Batal
                            </button>
                        </div>
                    </form>
                ) : (
                    /* ================= MODE LIHAT (VIEW DETAIL) ================= */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[950px] mx-auto">

                        {/* Header Info: Avatar Kiri, Info Kanan (Merapat) */}
                        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start mb-12">

                            {/* Kiri: Avatar Teknisi */}
                            <div className="flex flex-col items-center shrink-0 w-[180px]">
                                <div className="w-36 h-36 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-200 mb-5 relative group">
                                    <img src={ticketData.avatar} alt="Teknisi" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Teknisi Ditugaskan</p>
                                <p className="text-[18px] font-black text-blue-900 text-center leading-tight">{ticketData.teknisi}</p>
                            </div>

                            {/* Kanan: Grid Informasi Esensial (Presisi & Rapi) */}
                            <div className="flex flex-row flex-wrap gap-x-20 gap-y-10 mt-2">
                                {/* Kolom 1 */}
                                <div className="flex flex-col gap-10">
                                    <div>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Deadline Perbaikan
                                        </p>
                                        <div className="bg-slate-50 py-2.5 px-6 rounded-xl border border-slate-100 inline-block shadow-sm">
                                            <p className="text-[16px] font-bold text-slate-700">{formatDateVisual(ticketData.deadline)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Tingkat Prioritas
                                        </p>
                                        <div className={`inline-flex items-center rounded-full px-8 py-2 border text-[12px] font-black tracking-widest shadow-sm uppercase ${getPriorityStyle(ticketData.kategori)}`}>
                                            {ticketData.kategori}
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom 2 */}
                                <div className="flex flex-col gap-10">
                                    <div>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                            Nomor Task
                                        </p>
                                        <div className="bg-slate-50 py-2.5 px-6 rounded-xl border border-slate-100 inline-block shadow-sm">
                                            <p className="text-[16px] font-bold text-slate-700">{ticketData.noTask}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* List Detail Kendala */}
                        <div className="mb-10 w-full">
                            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Detail Kendala & Tugas</p>
                            <div className="bg-[#f8fafc] border border-slate-100 rounded-[28px] p-8 shadow-inner min-h-[120px]">
                                <p className="text-[15px] font-semibold text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {ticketData.detailPesanan}
                                </p>
                            </div>
                        </div>

                        {/* Dokumentasi Visual */}
                        <div className="mb-12 w-full">
                            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Lampiran Dokumentasi</p>
                            <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                                {ticketData.dokumentasi.map((img, i) => (
                                    <div key={i} className="w-[280px] h-[180px] shrink-0 bg-slate-100 rounded-[24px] overflow-hidden shadow-md border-4 border-white group relative cursor-pointer">
                                        <img src={img} alt={`Dokumentasi ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tombol Aksi (Hanya Reopen & Completed) */}
                        <div className="flex gap-4 w-full mt-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 bg-[#F59E0B] hover:bg-amber-600 text-white font-black py-4 rounded-2xl text-[15px] shadow-[0_8px_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Reopen
                            </button>
                            <button
                                onClick={handleComplete}
                                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black py-4 rounded-2xl text-[15px] shadow-[0_8px_20px_rgba(34,197,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                Completed
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}