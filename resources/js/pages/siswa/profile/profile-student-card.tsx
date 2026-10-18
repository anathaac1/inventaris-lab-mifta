import { User } from 'lucide-react';

interface ProfileStudentCardProps {
    studentName: string;
    studentClass: string;
    studentUsername: string;
    avatarInitials: string;
}

export function ProfileStudentCard({
    studentName,
    studentClass,
    studentUsername,
    avatarInitials
}: ProfileStudentCardProps) {
    return (
        <div className="rounded-xl bg-[#0256D0] text-white p-5 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border border-white/60 bg-white/10 flex items-center justify-center text-white shrink-0 font-bold text-lg shadow-inner">
                    {avatarInitials}
                </div>
                <div>
                    <h2 className="text-base font-bold">{studentName}</h2>
                    <p className="text-xs text-blue-100 font-medium">{studentClass}</p>
                    <p className="text-[11px] text-blue-200 font-mono mt-0.5">
                        Username: {studentUsername}
                    </p>
                </div>
            </div>
            <div className="hidden sm:block text-right">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                    Siswa Aktif
                </span>
            </div>
        </div>
    );
}
