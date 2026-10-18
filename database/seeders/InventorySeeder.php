<?php

namespace Database\Seeders;

use App\Models\Alat;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Siswa & Admin Users
        $siswa = User::firstOrCreate(
            ['email' => 'kenho.imut@smkn1kotabekasi.sch.id'],
            [
                'name' => 'Kenho Imut',
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'class' => 'XII RPL 2 | Rekayasa Perangkat Lunak',
                'nisn' => '0067829102',
                'phone' => '0812-3456-7890',
            ]
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@smkn1kotabekasi.sch.id'],
            [
                'name' => 'Admin Lab RPL',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'class' => null,
                'nisn' => null,
                'phone' => '0812-9999-8888',
            ]
        );

        // 2. Seed Items
        $items = [
            [
                'name' => 'Laptop Lenovo',
                'category' => 'Laptop',
                'code' => 'EL-001',
                'stock' => 36,
                'total' => 40,
                'description' => 'Laptop Lenovo ThinkPad dengan spesifikasi Intel Core i5, RAM 8GB, SSD 256GB. Cocok untuk kegiatan praktikum apalagi buat ngoding ✨',
                'specs' => [
                    'Tipe' => 'Lenovo ThinkPad L14',
                    'Processor' => 'Intel Core i5-1135G7',
                    'RAM' => '8 GB DDR4',
                    'Penyimpanan' => 'SSD 256 GB NVMe',
                    'Layar' => '14" Full HD IPS'
                ],
                'icon_type' => 'laptop',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Laptop Acer',
                'category' => 'Laptop',
                'code' => 'EL-002',
                'stock' => 36,
                'total' => 40,
                'description' => 'Laptop Acer Aspire 5 bertenaga Intel Core i5 generasi terbaru dengan layar jernih untuk praktikum multimedia dan pemrograman.',
                'specs' => [
                    'Tipe' => 'Acer Aspire 5 A514',
                    'Processor' => 'Intel Core i5-1135G7',
                    'RAM' => '8 GB DDR4',
                    'Penyimpanan' => 'SSD 512 GB NVMe',
                    'Layar' => '14" FHD Acer ComfyView'
                ],
                'icon_type' => 'laptop',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Charger Lenovo',
                'category' => 'Elektrikal',
                'code' => 'EL-003',
                'stock' => 36,
                'total' => 40,
                'description' => 'Adaptor charger original Lenovo 65W Type-C fast charging untuk laptop lab.',
                'specs' => [
                    'Daya' => '65 Watt',
                    'Konektor' => 'USB Type-C',
                    'Panjang Kabel' => '1.8 Meter',
                    'Input' => '100-240V ~ 50/60Hz'
                ],
                'icon_type' => 'charger',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Charger Acer',
                'category' => 'Elektrikal',
                'code' => 'EL-004',
                'stock' => 36,
                'total' => 40,
                'description' => 'Adaptor charger original Acer 45W barrel connector dengan kabel tahan panas.',
                'specs' => [
                    'Daya' => '45 Watt',
                    'Konektor' => 'DC Barrel 3.0 x 1.1mm',
                    'Panjang Kabel' => '1.5 Meter',
                    'Input' => '100-240V ~ 50/60Hz'
                ],
                'icon_type' => 'charger',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Mouse',
                'category' => 'Peripheral',
                'code' => 'PR-001',
                'stock' => 36,
                'total' => 45,
                'description' => 'Mouse optik USB ergonomis responsif untuk navigasi dan desain UI/UX.',
                'specs' => [
                    'Sensor' => 'Optical 1600 DPI',
                    'Konektivitas' => 'USB 2.0 Wired',
                    'Panjang Kabel' => '1.5 Meter',
                    'Kompatibilitas' => 'Windows / Linux / macOS'
                ],
                'icon_type' => 'mouse',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'USB Lan Tp-Link',
                'category' => 'Peripheral',
                'code' => 'PR-002',
                'stock' => 36,
                'total' => 40,
                'description' => 'Adapter USB to RJ45 Gigabit Ethernet untuk praktikum jaringan komputer dan server.',
                'specs' => [
                    'Kecepatan' => '10/100/1000 Mbps Gigabit',
                    'Port Input' => 'USB 3.0 Type-A',
                    'Port Output' => 'RJ45 Ethernet',
                    'Chipset' => 'Realtek RTL8153'
                ],
                'icon_type' => 'lan',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Headset',
                'category' => 'Peripheral',
                'code' => 'PR-003',
                'stock' => 36,
                'total' => 38,
                'description' => 'Headset multimedia dengan mikrofon noise cancelling untuk praktikum audio video dan meeting.',
                'specs' => [
                    'Driver' => '40mm Neodymium',
                    'Mikrofon' => 'Omnidirectional Noise Cancelling',
                    'Konektor' => '3.5mm Audio Jack + Splitter',
                    'Panjang Kabel' => '2.0 Meter'
                ],
                'icon_type' => 'headset',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Kabel Roll Listrik',
                'category' => 'Elektrikal',
                'code' => 'EL-005',
                'stock' => 36,
                'total' => 40,
                'description' => 'Kabel roll ekstensi 10 meter dengan 4 stopkontak arde berstandar SNI.',
                'specs' => [
                    'Panjang Kabel' => '10 Meter',
                    'Jumlah Lubang' => '4 Stopkontak Arde',
                    'Beban Maksimal' => '2500 Watt / 10A',
                    'Standar' => 'SNI 04-3892.1-2006'
                ],
                'icon_type' => 'power',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Obeng Plus',
                'category' => 'Tools',
                'code' => 'TL-001',
                'stock' => 36,
                'total' => 40,
                'description' => 'Obeng plus magnetik PH1 presisi untuk perakitan PC dan maintenance casing laptop.',
                'specs' => [
                    'Tipe Tip' => 'Phillips PH1 Magnetik',
                    'Panjang Batang' => '100 mm',
                    'Material' => 'Chrome Vanadium (Cr-V)',
                    'Grip' => 'Karet Anti Slip'
                ],
                'icon_type' => 'screwdriver',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Obeng Min',
                'category' => 'Tools',
                'code' => 'TL-002',
                'stock' => 36,
                'total' => 40,
                'description' => 'Obeng minus presisi SL3 untuk pembongkaran hardware dan peripheral lab.',
                'specs' => [
                    'Tipe Tip' => 'Slotted SL3.0 Magnetik',
                    'Panjang Batang' => '75 mm',
                    'Material' => 'Chrome Vanadium (Cr-V)',
                    'Grip' => 'Karet Anti Slip'
                ],
                'icon_type' => 'screwdriver',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Speaker',
                'category' => 'Peripheral',
                'code' => 'PR-004',
                'stock' => 36,
                'total' => 40,
                'description' => 'Speaker USB stereo compact dengan kontrol volume suara jernih.',
                'specs' => [
                    'Daya' => 'USB 5V Powered (6W RMS)',
                    'Konektor' => '3.5mm Aux + USB Power',
                    'Konfigurasi' => '2.0 Channel Stereo',
                    'Kontrol' => 'In-line Volume Control'
                ],
                'icon_type' => 'speaker',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Keyboard Kabel',
                'category' => 'Peripheral',
                'code' => 'PR-005',
                'stock' => 36,
                'total' => 40,
                'description' => 'Keyboard membran full-size tahan tumpahan air dengan layout standar US.',
                'specs' => [
                    'Layout' => '104 Keys Full Size QWERTY',
                    'Tipe Switch' => 'Membrane Silent Tactile',
                    'Konektivitas' => 'USB 2.0 Wired (1.5m)',
                    'Fitur' => 'Spill-resistant design'
                ],
                'icon_type' => 'keyboard',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Gunting Merah',
                'category' => 'Tools',
                'code' => 'TL-003',
                'stock' => 36,
                'total' => 40,
                'description' => 'Gunting serbaguna stainless steel dengan grip merah ergonomis untuk pemotongan kabel ties dan packaging.',
                'specs' => [
                    'Ukuran' => '7.5 Inch (19 cm)',
                    'Mata Pisau' => 'Heavy Duty Stainless Steel',
                    'Gagang' => 'ABS Ergonomic Red Handle'
                ],
                'icon_type' => 'scissors',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Keyboard Wireless',
                'category' => 'Peripheral',
                'code' => 'PR-006',
                'stock' => 36,
                'total' => 40,
                'description' => 'Keyboard wireless 2.4GHz slim compact dengan baterai hemat daya.',
                'specs' => [
                    'Konektivitas' => 'Wireless 2.4 GHz Nano USB Dongle',
                    'Jangkauan' => 'Hingga 10 Meter',
                    'Daya' => '2x AAA Battery',
                    'Profil' => 'Slim Low-profile Chocolate Keycaps'
                ],
                'icon_type' => 'keyboard',
                'is_visible_to_students' => true,
            ],
            [
                'name' => 'Flashdisk',
                'category' => 'Peripheral',
                'code' => 'PR-007',
                'stock' => 36,
                'total' => 40,
                'description' => 'Flash drive USB 3.2 64GB transfer cepat untuk bootable OS dan backup tugas.',
                'specs' => [
                    'Kapasitas' => '64 GB',
                    'Kecepatan' => 'Read up to 100 MB/s',
                    'Interface' => 'USB 3.2 Gen 1 Backward Compatible',
                    'Bahan' => 'Logam Compact Ringan'
                ],
                'icon_type' => 'flashdisk',
                'is_visible_to_students' => true,
            ]
        ];

        $createdAlats = [];
        foreach ($items as $itemData) {
            $createdAlats[$itemData['code']] = Alat::updateOrCreate(
                ['code' => $itemData['code']],
                $itemData
            );
        }

        // 3. Seed Initial Loans
        if (isset($createdAlats['EL-001'])) {
            Peminjaman::create([
                'user_id' => $siswa->id,
                'alat_id' => $createdAlats['EL-001']->id,
                'borrower_name' => $siswa->name,
                'borrower_class' => 'XII RPL 2',
                'borrow_date' => '2024-08-03',
                'return_estimate' => '2024-08-05',
                'status' => 'Sedang Dipinjam',
                'notes' => 'Praktikum Pemrograman Web Lanjut',
            ]);
        }

        if (isset($createdAlats['PR-001'])) {
            Peminjaman::create([
                'user_id' => $siswa->id,
                'alat_id' => $createdAlats['PR-001']->id,
                'borrower_name' => $siswa->name,
                'borrower_class' => 'XII RPL 2',
                'borrow_date' => '2024-08-03',
                'return_estimate' => '2024-08-05',
                'status' => 'Sedang Dipinjam',
                'notes' => 'Navigasi praktikum coding',
            ]);

            // Riwayat yang sudah dikembalikan
            Peminjaman::create([
                'user_id' => $siswa->id,
                'alat_id' => $createdAlats['PR-001']->id,
                'borrower_name' => $siswa->name,
                'borrower_class' => 'XII RPL 2',
                'borrow_date' => '2024-08-01',
                'return_estimate' => '2024-08-02',
                'return_date' => '2024-08-05',
                'status' => 'Dikembalikan',
                'notes' => 'Praktikum Web',
            ]);
        }
    }
}
