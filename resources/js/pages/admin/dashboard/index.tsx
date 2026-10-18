import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Laptop, Mouse, Wrench, Zap } from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredItems,
    getStoredLoans,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';
import { getStoredAccounts } from '@/data/auth-store';
import { HeroOperationalBanner } from './hero-operational-banner';
import { DimensionMetrics, type DimensionTab } from './dimension-metrics';
import { ActiveLoansMonitor } from './active-loans-monitor';
import { CategoryDistribution, type CategoryStatItem } from './category-distribution';
import { ClassDistribution, type ClassStatItem } from './class-distribution';

// Smooth counter animation hook
function useAnimatedCounter(target: number, duration: number = 1000) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let frame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(easeOut * target));

            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}

export default function AdminDashboard() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loans, setLoans] = useState<LoanItem[]>([]);
    const [activeTab, setActiveTab] = useState<DimensionTab>('all');
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        setItems(getStoredItems());
        setLoans(getStoredLoans());

        const timer = setTimeout(() => setIsAnimated(true), 50);

        const handleItemsChange = () => setItems(getStoredItems());
        const handleLoansChange = () => setLoans(getStoredLoans());

        window.addEventListener('inventory_items_changed', handleItemsChange);
        window.addEventListener('inventory_loans_changed', handleLoansChange);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('inventory_items_changed', handleItemsChange);
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
        };
    }, []);

    // Summary calculations
    const totalItems = items.length;
    const totalPhysicalUnits = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const totalAvailableStock = items.reduce((sum, item) => sum + (item.stock || 0), 0);
    const activeLoans = loans.filter((loan) => loan.status === 'Sedang Dipinjam');
    const accounts = getStoredAccounts().filter((a) => a.role === 'siswa');

    const availabilityPercentage = totalPhysicalUnits > 0
        ? Math.round((totalAvailableStock / totalPhysicalUnits) * 100)
        : 100;

    // Animated values
    const animatedAvailableStock = useAnimatedCounter(totalAvailableStock, 1100);
    const animatedTotalUnits = useAnimatedCounter(totalPhysicalUnits, 1200);
    const animatedPercentage = useAnimatedCounter(availabilityPercentage, 1000);
    const animatedCatalogCount = useAnimatedCounter(totalItems, 900);
    const animatedActiveLoans = useAnimatedCounter(activeLoans.length, 800);
    const animatedStudentCount = useAnimatedCounter(accounts.length, 800);

    // Category breakdown
    const categoryStats: CategoryStatItem[] = [
        {
            name: 'Laptop & Komputer',
            icon: Laptop,
            barColor: 'bg-blue-600',
            units: items.filter((i) => i.category === 'Laptop').reduce((s, i) => s + i.total, 0),
            available: items.filter((i) => i.category === 'Laptop').reduce((s, i) => s + i.stock, 0)
        },
        {
            name: 'Peripheral & Aksesoris',
            icon: Mouse,
            barColor: 'bg-sky-500',
            units: items.filter((i) => i.category === 'Peripheral').reduce((s, i) => s + i.total, 0),
            available: items.filter((i) => i.category === 'Peripheral').reduce((s, i) => s + i.stock, 0)
        },
        {
            name: 'Tools & Perkakas',
            icon: Wrench,
            barColor: 'bg-emerald-500',
            units: items.filter((i) => i.category === 'Tools').reduce((s, i) => s + i.total, 0),
            available: items.filter((i) => i.category === 'Tools').reduce((s, i) => s + i.stock, 0)
        },
        {
            name: 'Elektrikal & Kabel',
            icon: Zap,
            barColor: 'bg-amber-500',
            units: items.filter((i) => i.category === 'Elektrikal').reduce((s, i) => s + i.total, 0),
            available: items.filter((i) => i.category === 'Elektrikal').reduce((s, i) => s + i.stock, 0)
        }
    ];

    // Class loan breakdown
    const classStats: ClassStatItem[] = [
        { name: 'X RPL A', active: activeLoans.filter((l) => l.borrowerClass.includes('X RPL A')).length },
        { name: 'X RPL B', active: activeLoans.filter((l) => l.borrowerClass.includes('X RPL B')).length },
        { name: 'XI RPL A', active: activeLoans.filter((l) => l.borrowerClass.includes('XI RPL A')).length },
        { name: 'XI RPL B', active: activeLoans.filter((l) => l.borrowerClass.includes('XI RPL B')).length },
        { name: 'XII RPL A', active: activeLoans.filter((l) => l.borrowerClass.includes('XII RPL A')).length },
        { name: 'XII RPL B', active: activeLoans.filter((l) => l.borrowerClass.includes('XII RPL B')).length }
    ];

    return (
        <AdminLayout currentTab="dashboard">
            <Head title="Admin CMS - Ringkasan & Metrik Lab" />

            <div className="space-y-6">
                {/* 1. Real-Time Operational Hero Banner */}
                {/* <HeroOperationalBanner
                    availableStock={animatedAvailableStock}
                    totalUnits={animatedTotalUnits}
                    percentage={animatedPercentage}
                /> */}

                {/* 2. Interactive Dimension Metric Bar */}
                <DimensionMetrics
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    totalUnits={animatedTotalUnits}
                    availableStock={animatedAvailableStock}
                    catalogCount={animatedCatalogCount}
                    activeLoansCount={animatedActiveLoans}
                    studentCount={animatedStudentCount}
                />

                {/* 3. Monitoring & Analytics Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left 2 Cols: Live Loan Circulation Table */}
                    <ActiveLoansMonitor activeLoans={activeLoans} />

                    {/* Right 1 Col: Visual Analytics Breakdown */}
                    <div className="space-y-6">
                        <CategoryDistribution
                            categoryStats={categoryStats}
                            totalPhysicalUnits={totalPhysicalUnits}
                            isAnimated={isAnimated}
                        />

                        <ClassDistribution classStats={classStats} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
