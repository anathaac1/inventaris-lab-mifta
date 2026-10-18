import { ShieldCheck, Clock } from 'lucide-react';

interface ProfileBannerProps {
    adminName: string;
    adminUsername: string;
    adminInitials: string;
}

export function ProfileBanner({ adminName, adminUsername, adminInitials }: ProfileBannerProps) {
    return (
        <div className="rounded-xl bg-gradient-to-r from-[#0256D0] via-[#0448AB] to-[#0A1C38] text-white p-5 sm:p-6 shadow-xs relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 font-black text-xl shadow-xs">
                        {adminInitials}
                    </div>

                    {/* Identity */}
                    <div className="min-w-0">
                        {/* <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-blue-100 border border-white/20 mb-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-300" />
                            <span>Kepala Laboratorium</span>
                        </span> */}
                        <h2 className="text-base sm:text-lg font-bold text-white truncate">
                            {adminName}
                        </h2>
                        <p className="text-xs text-blue-100 font-medium">
                            Rekayasa Perangkat Lunak • SMKN 1 Kota Bekasi
                        </p>
                        <p className="text-[11px] text-blue-200 mt-0.5">
                            Username: {adminUsername}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs text-white shrink-0">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Sesi Aktif</span>
                </div> */}
            </div>
        </div>
    );
}
