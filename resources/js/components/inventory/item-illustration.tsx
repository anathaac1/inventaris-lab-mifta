import React from 'react';

interface ItemIllustrationProps {
    type: string;
    className?: string;
}

export function ItemIllustration({ type, className = 'w-16 h-16' }: ItemIllustrationProps) {
    switch (type) {
        case 'laptop':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Laptop Screen Frame */}
                    <rect x="18" y="10" width="64" height="42" rx="3" fill="#1E293B" />
                    <rect x="22" y="14" width="56" height="34" rx="1.5" fill="#0EA5E9" />
                    {/* Screen content/code preview */}
                    <path d="M26 20H42M26 25H36M26 30H48M26 35H32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
                    <circle cx="68" cy="28" r="6" fill="#38BDF8" fillOpacity="0.4" />
                    {/* Hinge */}
                    <rect x="42" y="52" width="16" height="3" fill="#334155" />
                    {/* Laptop Base */}
                    <path d="M8 55L14 70H86L92 55H8Z" fill="#334155" />
                    <path d="M8 55H92L88 58H12L8 55Z" fill="#64748B" />
                    {/* Keyboard and Trackpad */}
                    <rect x="20" y="57" width="60" height="7" rx="1" fill="#1E293B" />
                    <rect x="44" y="65" width="12" height="4" rx="1" fill="#475569" />
                </svg>
            );

        case 'charger':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Adapter Brick */}
                    <rect x="22" y="24" width="38" height="40" rx="6" fill="#1E293B" />
                    <rect x="26" y="28" width="30" height="32" rx="4" fill="#334155" />
                    {/* Plug pins */}
                    <rect x="30" y="14" width="4" height="10" rx="1" fill="#94A3B8" />
                    <rect x="48" y="14" width="4" height="10" rx="1" fill="#94A3B8" />
                    {/* Cable coming out */}
                    <path d="M41 64C41 72 56 70 65 62C72 56 74 42 78 40C82 38 88 44 86 52" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
                    {/* Connector head */}
                    <rect x="83" y="52" width="6" height="12" rx="2" fill="#0EA5E9" />
                    <rect x="85" y="64" width="2" height="5" fill="#CBD5E1" />
                </svg>
            );

        case 'mouse':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Mouse Body */}
                    <ellipse cx="50" cy="46" rx="20" ry="28" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                    <path d="M30 40C30 25 39 18 50 18C61 18 70 25 70 40" stroke="#94A3B8" strokeWidth="1.5" />
                    {/* Split line */}
                    <line x1="50" y1="18" x2="50" y2="40" stroke="#94A3B8" strokeWidth="2" />
                    {/* Scroll Wheel */}
                    <rect x="47" y="26" width="6" height="10" rx="3" fill="#0284C7" />
                    {/* Shadow / Accent */}
                    <ellipse cx="50" cy="56" rx="10" ry="12" fill="#E2E8F0" fillOpacity="0.6" />
                </svg>
            );

        case 'lan':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* USB Body */}
                    <rect x="18" y="32" width="22" height="16" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
                    {/* USB Plug */}
                    <rect x="8" y="35" width="10" height="10" rx="1" fill="#94A3B8" />
                    {/* Short Cable */}
                    <path d="M40 40H58" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                    {/* RJ45 Box Body */}
                    <rect x="58" y="24" width="34" height="32" rx="4" fill="#0284C7" />
                    {/* RJ45 Port opening */}
                    <rect x="68" y="34" width="18" height="12" rx="2" fill="#0F172A" />
                    <rect x="73" y="30" width="8" height="4" fill="#38BDF8" />
                </svg>
            );

        case 'headset':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Headband */}
                    <path d="M26 44C26 25 36 14 50 14C64 14 74 25 74 44" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                    {/* Left Ear Cup */}
                    <rect x="18" y="38" width="14" height="24" rx="7" fill="#0284C7" />
                    <rect x="16" y="42" width="6" height="16" rx="3" fill="#F8FAFC" stroke="#CBD5E1" />
                    {/* Right Ear Cup */}
                    <rect x="68" y="38" width="14" height="24" rx="7" fill="#0284C7" />
                    <rect x="78" y="42" width="6" height="16" rx="3" fill="#F8FAFC" stroke="#CBD5E1" />
                    {/* Microphone arm */}
                    <path d="M26 54C26 68 40 70 46 68" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="46" y="65" width="8" height="6" rx="3" fill="#1E293B" />
                </svg>
            );

        case 'power':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Stand & Handle */}
                    <path d="M30 68L22 72M70 68L78 72" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                    <path d="M50 14V8M42 8H58" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
                    {/* Outer Drum */}
                    <circle cx="50" cy="44" r="26" fill="#F8FAFC" stroke="#0284C7" strokeWidth="4" />
                    {/* Cable rolled */}
                    <circle cx="50" cy="44" r="22" stroke="#F97316" strokeWidth="4" strokeDasharray="6 3" />
                    {/* Center Core with outlets */}
                    <circle cx="50" cy="44" r="14" fill="#1E293B" />
                    <circle cx="45" cy="40" r="2" fill="#E2E8F0" />
                    <circle cx="55" cy="40" r="2" fill="#E2E8F0" />
                    <circle cx="45" cy="48" r="2" fill="#E2E8F0" />
                    <circle cx="55" cy="48" r="2" fill="#E2E8F0" />
                </svg>
            );

        case 'screwdriver':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shaft */}
                    <rect x="48" y="10" width="4" height="34" fill="#94A3B8" />
                    {/* Tip */}
                    <path d="M47 8L50 4L53 8H47Z" fill="#475569" />
                    {/* Handle */}
                    <path d="M42 42C42 40 58 40 58 42L59 66C59 72 56 75 50 75C44 75 41 72 41 66L42 42Z" fill="#16A34A" />
                    {/* Handle Grips */}
                    <line x1="45" y1="48" x2="45" y2="64" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
                    <line x1="50" y1="46" x2="50" y2="66" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="55" y1="48" x2="55" y2="64" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
                </svg>
            );

        case 'speaker':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Speaker Body */}
                    <rect x="30" y="12" width="40" height="56" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" />
                    {/* Tweeter (Small Cone) */}
                    <circle cx="50" cy="28" r="7" fill="#0F172A" stroke="#0284C7" strokeWidth="1.5" />
                    <circle cx="50" cy="28" r="3" fill="#38BDF8" />
                    {/* Woofer (Big Cone) */}
                    <circle cx="50" cy="50" r="13" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
                    <circle cx="50" cy="50" r="6" fill="#0284C7" />
                </svg>
            );

        case 'keyboard':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Keyboard Body */}
                    <rect x="12" y="24" width="76" height="34" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                    {/* Key rows */}
                    <rect x="16" y="28" width="68" height="4" rx="1" fill="#334155" />
                    <rect x="16" y="34" width="68" height="4" rx="1" fill="#334155" />
                    <rect x="16" y="40" width="68" height="4" rx="1" fill="#334155" />
                    {/* Spacebar */}
                    <rect x="32" y="46" width="36" height="4" rx="1" fill="#0284C7" />
                </svg>
            );

        case 'scissors':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Left Blade */}
                    <path d="M48 38L32 10H38L52 35" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
                    {/* Right Blade */}
                    <path d="M52 38L68 10H62L48 35" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                    {/* Pivot Screw */}
                    <circle cx="50" cy="38" r="3" fill="#475569" />
                    {/* Left Handle */}
                    <circle cx="36" cy="58" r="13" fill="none" stroke="#DC2626" strokeWidth="5" />
                    {/* Right Handle */}
                    <circle cx="64" cy="58" r="13" fill="none" stroke="#DC2626" strokeWidth="5" />
                </svg>
            );

        case 'flashdisk':
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* USB plug */}
                    <rect x="42" y="14" width="16" height="12" rx="1" fill="#94A3B8" />
                    <rect x="45" y="18" width="3" height="3" fill="#475569" />
                    <rect x="52" y="18" width="3" height="3" fill="#475569" />
                    {/* Main Drive Body */}
                    <rect x="36" y="26" width="28" height="44" rx="4" fill="#0284C7" />
                    {/* Lanyard Hole */}
                    <ellipse cx="50" cy="62" rx="4" ry="2" fill="#0F172A" />
                    {/* LED / Logo accent */}
                    <rect x="44" y="34" width="12" height="4" rx="1" fill="#38BDF8" />
                </svg>
            );

        default:
            return (
                <svg viewBox="0 0 100 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="25" y="20" width="50" height="40" rx="6" fill="#0284C7" />
                    <circle cx="50" cy="40" r="10" fill="white" fillOpacity="0.8" />
                </svg>
            );
    }
}
