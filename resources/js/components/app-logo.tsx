import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-zinc-900 dark:text-white">
                    Pinjam<span className="text-blue-600 dark:text-blue-400">Yuk!</span>
                </span>
                <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                    Lab RPL SMKN 1
                </span>
            </div>
        </>
    );
}
