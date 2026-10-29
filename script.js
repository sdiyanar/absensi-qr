let donutChartInstance = null;
let barChartInstance = null;
let html5QrCode = null;

// FUNGSI UTAMA LOGIN & NAVIGASI
function handleLogin() {
    const role = document.getElementById('role-select').value;
    const password = document.getElementById('password-input').value;

    // Pengecekan Sandi Akses Guru & Admin
    if (role === 'guru' && password !== 'guru123') {
        alert('Sandi Guru salah! Gunakan: guru123');
        return;
    }
    if (role === 'admin' && password !== 'admin123') {
        alert('Sandi Admin salah! Gunakan: admin123');
        return;
    }

    // Sembunyikan semua halaman
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('student-page').style.display = 'none';
    document.getElementById('teacher-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';

    // Tampilkan halaman sesuai pilihan peran
    if (role === 'siswa') {
        document.getElementById('student-page').style.display = 'block';
        initScanner();
    } else if (role === 'guru') {
        document.getElementById('teacher-page').style.display = 'block';
    } else if (role === 'admin') {
        document.getElementById('admin-page').style.display = 'block';
        renderCharts(); // Gambar diagram saat halaman Admin dibuka
    }

    document.getElementById('password-input').value = '';
}

function goBackToLogin() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.log(err));
    }

    document.getElementById('student-page').style.display = 'none';
    document.getElementById('teacher-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
}

// LOGIKA DETEKSI JAM OTOMATIS
function cekWaktuAbsen() {
    const sekarang = new Date();
    const jam = sekarang.getHours();
    const menit = sekarang.getMinutes();

    // Jika scan sebelum/tepat jam 07.00 = Hadir, jika lewat = Terlambat
    if (jam < 7 || (jam === 7 && menit === 0)) {
        return "Hadir (Tepat Waktu)";
    } else {
        return "Terlambat";
    }
}

// INISIALISASI CAMERA QR SCANNER
function initScanner() {
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
            const statusAbsen = cekWaktuAbsen();
            document.getElementById('result').innerHTML = `✅ <strong>Berhasil Absen!</strong><br>NISN/ID: ${decodedText}<br>Status: <strong>${statusAbsen}</strong>`;
        },
        (errorMessage) => {}
    ).catch(err => {
        document.getElementById('result').innerText = "Kamera siap dalam mode pemindaian.";
    });
}

// FUNGSI FILTER DATA BERDASARKAN KELAS
function filterDataKelas() {
    const pilihanKelas = document.getElementById('filter-kelas').value;
    const barisTabel = document.querySelectorAll('#tabel-absensi tbody tr');

    barisTabel.forEach(baris => {
        const kelasSiswa = baris.getAttribute('data-kelas');
        if (pilihanKelas === 'semua' || kelasSiswa === pilihanKelas) {
            baris.style.display = '';
        } else {
            baris.style.display = 'none';
        }
    });
}

// RENDERING DIAGRAM BULAT (DONUT) & DIAGRAM BATANG (BAR)
function renderCharts() {
    // 1. Diagram Bulat (Donut Chart)
    const ctxDonut = document.getElementById('donutChart').getContext('2d');
    if (donutChartInstance) donutChartInstance.destroy();

    donutChartInstance = new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Hadir', 'Telat', 'Izin', 'Sakit', 'Alfa'],
            datasets: [{
                data: [38, 3, 2, 1, 2],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#f97316', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 9 } } }
            }
        }
    });

    // 2. Diagram Batang (Bar Chart)
    const ctxBar = document.getElementById('barChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();

    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Hadir', 'Telat', 'Izin', 'Sakit', 'Alfa'],
            datasets: [{
                label: 'Jumlah Siswa',
                data: [38, 3, 2, 1, 2],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#f97316', '#ef4444'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { font: { size: 9 } } },
                x: { ticks: { font: { size: 9 } } }
            }
        }
    });
}

// UBAH STATUS SISWA OLEH GURU
function ubahStatus(selectElem, namaSiswa) {
    alert("Status " + namaSiswa + " berhasil diperbarui menjadi: " + selectElem.value);
}
