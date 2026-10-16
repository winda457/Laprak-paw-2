/**
 * ==============================================================================
 * StudentFlow - Personal Dashboard Mahasiswa
 * Memenuhi seluruh spesifikasi tugas:
 * 1. Interaktif (CRUD Tugas & Catatan)
 * 2. LocalStorage Persistence
 * 3. Fitur ES6+:
 *    - let & const secara konsisten (tanpa var)
 *    - Arrow Functions (minimal 3, diimplementasikan di berbagai event & helper)
 *    - Template Literals untuk rendering dinamis
 *    - Fungsi Asinkron (Async / Await) untuk memuat kutipan inspirasi
 *    - Implementasi Classes (Class Task & Class DashboardApp)
 * ==============================================================================
 */

/**
 * ==============================================================================
 * 1. IMPLEMENTASI CLASS ES6: Task
 * Merepresentasikan sebuah objek tugas kuliah
 * ==============================================================================
 */
class Task {
  constructor(id, title, subject, deadline, priority = 'Sedang', notes = '', completed = false) {
    this.id = id || Date.now().toString();
    this.title = title;
    this.subject = subject;
    this.deadline = deadline; // Format YYYY-MM-DD
    this.priority = priority; // 'Tinggi', 'Sedang', 'Rendah'
    this.notes = notes;
    this.completed = completed;
    this.createdAt = new Date().toISOString();
  }

  // Mengubah status selesai / belum selesai
  toggleStatus() {
    this.completed = !this.completed;
  }

  // Memperbarui informasi tugas
  update(data) {
    this.title = data.title;
    this.subject = data.subject;
    this.deadline = data.deadline;
    this.priority = data.priority;
    this.notes = data.notes;
  }

  // Mengecek apakah deadline tersisa <= 2 hari dari sekarang
  isUpcoming() {
    if (this.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(this.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  }
}

/**
 * ==============================================================================
 * 2. IMPLEMENTASI CLASS ES6: DashboardApp
 * Mengelola state aplikasi, CRUD tugas, catatan cepat, dan rendering UI
 * ==============================================================================
 */
class DashboardApp {
  constructor() {
    this.tasks = [];
    this.currentFilter = 'all'; // 'all', 'pending', 'completed'
    this.searchQuery = '';
    this.isEditMode = false;
    this.currentEditId = null;

    // Inisialisasi elemen DOM
    this.taskListContainer = document.getElementById('taskListContainer');
    this.taskModal = document.getElementById('taskModal');
    this.taskForm = document.getElementById('taskForm');
    this.modalTitle = document.getElementById('modalTitle');
    
    // Inputs Form
    this.taskIdInput = document.getElementById('taskIdInput');
    this.taskTitleInput = document.getElementById('taskTitleInput');
    this.taskSubjectInput = document.getElementById('taskSubjectInput');
    this.taskPriorityInput = document.getElementById('taskPriorityInput');
    this.taskDeadlineInput = document.getElementById('taskDeadlineInput');
    this.taskNotesInput = document.getElementById('taskNotesInput');

    // Controls
    this.taskSearchInput = document.getElementById('taskSearchInput');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.btnOpenAddModal = document.getElementById('btnOpenAddModal');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelTask = document.getElementById('btnCancelTask');
    this.refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

    // Stats Elements
    this.statTotalTasks = document.getElementById('statTotalTasks');
    this.statPendingTasks = document.getElementById('statPendingTasks');
    this.statCompletedTasks = document.getElementById('statCompletedTasks');
    this.statUpcomingTasks = document.getElementById('statUpcomingTasks');

    // Realtime Elements
    this.realtimeClock = document.getElementById('realtimeClock');
    this.realtimeDate = document.getElementById('realtimeDate');
    this.greetingText = document.getElementById('greetingText');
    this.currentDayBadge = document.getElementById('currentDayBadge');

    // Quick Notes
    this.quickNotesArea = document.getElementById('quickNotesArea');
    this.noteSaveStatus = document.getElementById('noteSaveStatus');
  }

  // Method Utama untuk Memulai Aplikasi
  init() {
    this.loadTasksFromStorage();
    this.loadNotesFromStorage();
    this.initClock();
    this.setupEventListeners();
    this.fetchDailyQuote(); // Memanggil Fungsi Asinkron (Async/Await)
    this.render();
  }

  /**
   * ============================================================================
   * 3. PENYIMPANAN LOKAL (LocalStorage)
   * ============================================================================
   */
  loadTasksFromStorage() {
    const stored = localStorage.getItem('student_tasks');
    if (stored) {
      try {
        const rawData = JSON.parse(stored);
        // ES6+ Arrow Function #1: Memetakan data JSON kembali menjadi instance Class Task
        this.tasks = rawData.map(item => new Task(
          item.id,
          item.title,
          item.subject,
          item.deadline,
          item.priority,
          item.notes,
          item.completed
        ));
      } catch (e) {
        console.error('Gagal mengurai data dari localStorage:', e);
        this.tasks = [];
      }
    } else {
      // Data Awal Bawaan jika belum ada data (Contoh realistis tugas mahasiswa)
      const sampleTasks = [
        new Task('1', 'Tugas Praktikum 2 PAW (Personal Dashboard)', 'Pengembangan Aplikasi Web', this.getFutureDateString(2), 'Tinggi', 'Implementasi ES6+, LocalStorage, CRUD interaktif.'),
        new Task('2', 'Laporan Praktikum Query Normalisasi', 'Basis Data Lanjut', this.getFutureDateString(4), 'Sedang', 'Upload ke portal e-learning format PDF.'),
        new Task('3', 'Review Jurnal Makalah Machine Learning', 'Kecerdasan Buatan', this.getFutureDateString(7), 'Rendah', 'Cari jurnal IEEE terindeks Scopus.')
      ];
      this.tasks = sampleTasks;
      this.saveTasksToStorage();
    }
  }

  saveTasksToStorage() {
    localStorage.setItem('student_tasks', JSON.stringify(this.tasks));
  }

  loadNotesFromStorage() {
    const savedNote = localStorage.getItem('student_quick_notes');
    if (savedNote !== null && this.quickNotesArea) {
      this.quickNotesArea.value = savedNote;
    }
  }

  saveNotesToStorage(content) {
    localStorage.setItem('student_quick_notes', content);
    if (this.noteSaveStatus) {
      this.noteSaveStatus.innerHTML = `<i class="fa-solid fa-check"></i> Tersimpan`;
    }
  }

  // Helper untuk mendapatkan tanggal beberapa hari ke depan (YYYY-MM-DD)
  getFutureDateString(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  /**
   * ============================================================================
   * 4. FUNGSI ASINKRON (Async / Await)
   * Mengambil kutipan motivasi belajar harian untuk mahasiswa
   * Dilengkapi fallback jika offline atau API tidak dapat dijangkau
   * ============================================================================
   */
  async fetchDailyQuote() {
    const quoteContent = document.getElementById('quoteContent');
    const quoteAuthor = document.getElementById('quoteAuthor');

    if (quoteContent) {
      quoteContent.textContent = 'Memuat kutipan motivasi hari ini...';
    }

    try {
      // Menggunakan API publik kata motivasi (ZenQuotes / DummyJSON)
      const response = await fetch('https://dummyjson.com/quotes/random');
      
      if (!response.ok) {
        throw new Error(`Gagal memuat API status: ${response.status}`);
      }

      const data = await response.json();
      
      // ES6 Template Literals untuk menampilkan kutipan
      if (quoteContent && quoteAuthor) {
        quoteContent.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `— ${data.author}`;
      }
    } catch (error) {
      // Fallback lokal jika offline / network error
      console.warn('Menggunakan kutipan fallback:', error);
      const studentQuotes = [
        { quote: 'Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan Anda dapat mengubah dunia.', author: 'Nelson Mandela' },
        { quote: 'Usaha yang kamu lakukan hari ini adalah penentu masa depan yang kamu impikan besok.', author: 'Motivasi Belajar' },
        { quote: 'Fokuslah pada proses dan konsistensi, maka hasil terbaik akan mengikuti.', author: 'Mahasiswa Berprestasi' },
        { quote: 'Jangan menunggu waktu yang sempurna, ambil kesempatan dan buat waktumu menjadi sempurna.', author: 'Anonim' }
      ];
      
      // Pilih secara acak
      const randomQuote = studentQuotes[Math.floor(Math.random() * studentQuotes.length)];
      if (quoteContent && quoteAuthor) {
        quoteContent.textContent = `"${randomQuote.quote}"`;
        quoteAuthor.textContent = `— ${randomQuote.author}`;
      }
    }
  }

  /**
   * ============================================================================
   * 5. JAM & SAPAAN REALTIME (ES6 Arrow Function)
   * ============================================================================
   */
  initClock() {
    const updateTime = () => {
      const now = new Date();
      
      // Format Waktu WIB
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      if (this.realtimeClock) {
        // ES6 Template Literal
        this.realtimeClock.textContent = `${hours}:${minutes}:${seconds} WIB`;
      }

      // Format Tanggal Bahasa Indonesia
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateStr = now.toLocaleDateString('id-ID', options);
      if (this.realtimeDate) {
        this.realtimeDate.textContent = dateStr;
      }

      if (this.currentDayBadge) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        this.currentDayBadge.textContent = days[now.getDay()];
      }

      // Sapaan Berdasarkan Waktu
      if (this.greetingText) {
        let greeting = 'Selamat Datang';
        const currentHour = now.getHours();
        if (currentHour >= 4 && currentHour < 11) {
          greeting = 'Selamat Pagi';
        } else if (currentHour >= 11 && currentHour < 15) {
          greeting = 'Selamat Siang';
        } else if (currentHour >= 15 && currentHour < 18) {
          greeting = 'Selamat Sore';
        } else {
          greeting = 'Selamat Malam';
        }
        // ES6 Template Literal
        this.greetingText.textContent = `${greeting}, Mahasiswa! 👋`;
      }
    };

    updateTime();
    // ES6+ Arrow Function #2: Interval jam realtime setiap detik
    setInterval(() => updateTime(), 1000);
  }

  /**
   * ============================================================================
   * 6. CRUD TUGAS (Create, Read, Update, Delete)
   * ============================================================================
   */
  
  // CREATE & UPDATE: Menyimpan data dari Modal Form
  handleFormSubmit(event) {
    event.preventDefault();

    const title = this.taskTitleInput.value.trim();
    const subject = this.taskSubjectInput.value.trim();
    const deadline = this.taskDeadlineInput.value;
    const priority = this.taskPriorityInput.value;
    const notes = this.taskNotesInput.value.trim();

    if (!title || !subject || !deadline) {
      alert('Mohon lengkapi judul tugas, mata kuliah, dan tenggat waktu.');
      return;
    }

    if (this.isEditMode && this.currentEditId) {
      // UPDATE: Edit Tugas yang Ada
      // ES6+ Arrow Function #3: Mencari objek tugas berdasarkan ID
      const taskToEdit = this.tasks.find(t => t.id === this.currentEditId);
      if (taskToEdit) {
        taskToEdit.update({ title, subject, deadline, priority, notes });
      }
    } else {
      // CREATE: Tambah Tugas Baru
      const newTask = new Task(
        Date.now().toString(),
        title,
        subject,
        deadline,
        priority,
        notes,
        false
      );
      this.tasks.unshift(newTask);
    }

    this.saveTasksToStorage();
    this.closeModal();
    this.render();
  }

  // DELETE: Menghapus tugas berdasarkan ID
  deleteTask(id) {
    // ES6+ Arrow Function #4: Mencari task untuk konfirmasi nama tugas
    const targetTask = this.tasks.find(t => t.id === id);
    const confirmMessage = targetTask 
      ? `Apakah Anda yakin ingin menghapus tugas "${targetTask.title}"?`
      : 'Apakah Anda yakin ingin menghapus tugas ini?';

    if (confirm(confirmMessage)) {
      // ES6+ Arrow Function #5: Filter untuk menyisihkan task yang dihapus
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasksToStorage();
      this.render();
    }
  }

  // TOGGLE: Mengubah status selesai/belum selesai
  toggleTask(id) {
    // ES6+ Arrow Function #6: Menemukan task dan mengubah statusnya
    const targetTask = this.tasks.find(t => t.id === id);
    if (targetTask) {
      targetTask.toggleStatus();
      this.saveTasksToStorage();
      this.render();
    }
  }

  // Buka Modal untuk Tambah Tugas
  openAddModal() {
    this.isEditMode = false;
    this.currentEditId = null;
    this.modalTitle.textContent = 'Tambah Tugas Kuliah';
    this.taskForm.reset();
    this.taskIdInput.value = '';
    
    // Set default deadline = besok
    this.taskDeadlineInput.value = this.getFutureDateString(1);
    this.taskPriorityInput.value = 'Sedang';

    this.taskModal.showModal();
    this.taskTitleInput.focus();
  }

  // Buka Modal untuk Edit Tugas
  openEditModal(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    this.isEditMode = true;
    this.currentEditId = id;
    // ES6 Template Literal
    this.modalTitle.textContent = `Edit Tugas: ${task.title}`;

    this.taskIdInput.value = task.id;
    this.taskTitleInput.value = task.title;
    this.taskSubjectInput.value = task.subject;
    this.taskPriorityInput.value = task.priority;
    this.taskDeadlineInput.value = task.deadline;
    this.taskNotesInput.value = task.notes || '';

    this.taskModal.showModal();
    this.taskTitleInput.focus();
  }

  closeModal() {
    this.taskModal.close();
    this.taskForm.reset();
    this.isEditMode = false;
    this.currentEditId = null;
  }

  /**
   * ============================================================================
   * 7. RENDERING DATA KE DOM MENGGUNAKAN TEMPLATE LITERALS
   * ============================================================================
   */
  render() {
    this.renderStats();
    this.renderTasks();
  }

  // Render Kartu Statistik Mahasiswa
  renderStats() {
    const total = this.tasks.length;
    // ES6+ Arrow Functions pada filter
    const pending = this.tasks.filter(t => !t.completed).length;
    const completed = this.tasks.filter(t => t.completed).length;
    const upcoming = this.tasks.filter(t => t.isUpcoming()).length;

    if (this.statTotalTasks) this.statTotalTasks.textContent = total;
    if (this.statPendingTasks) this.statPendingTasks.textContent = pending;
    if (this.statCompletedTasks) this.statCompletedTasks.textContent = completed;
    if (this.statUpcomingTasks) this.statUpcomingTasks.textContent = upcoming;
  }

  // Render Daftar Kartu Tugas
  renderTasks() {
    if (!this.taskListContainer) return;

    // Filter status tab
    let filtered = this.tasks.filter(task => {
      if (this.currentFilter === 'pending') return !task.completed;
      if (this.currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    // Filter pencarian
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(q) ||
        task.subject.toLowerCase().includes(q) ||
        (task.notes && task.notes.toLowerCase().includes(q))
      );
    }

    // Urutkan tugas: yang belum selesai & deadline terdekat di atas
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.deadline) - new Date(b.deadline);
    });

    // Jika tidak ada data
    if (filtered.length === 0) {
      // ES6 Template Literal untuk Empty State
      this.taskListContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clipboard-list"></i>
          <p><strong>Tidak ada tugas yang ditemukan</strong></p>
          <p class="text-muted">${this.searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Klik tombol "+ Tambah Tugas" di atas untuk menambahkan tugas baru.'}</p>
        </div>
      `;
      return;
    }

    // Helper format tanggal Indonesia
    const formatIndoDate = (dateStr) => {
      if (!dateStr) return '-';
      const parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Render daftar item menggunakan ES6 Template Literals
    this.taskListContainer.innerHTML = filtered.map(task => {
      const isUrgent = task.isUpcoming();
      const statusClass = task.completed ? 'completed' : '';
      const deadlineClass = isUrgent ? 'urgent' : '';
      const deadlineBadge = isUrgent 
        ? `<span class="deadline-warning"><i class="fa-solid fa-triangle-exclamation"></i> Segera</span>` 
        : '';

      return `
        <article class="task-card ${statusClass}" data-id="${task.id}">
          <div class="task-checkbox-wrap">
            <input 
              type="checkbox" 
              class="task-checkbox" 
              ${task.completed ? 'checked' : ''} 
              title="${task.completed ? 'Tandai belum selesai' : 'Tandai sudah selesai'}"
              data-action="toggle"
              data-id="${task.id}"
            >
          </div>

          <div class="task-info">
            <div class="task-meta">
              <span class="subject-badge">${task.subject}</span>
              <span class="priority-badge ${task.priority}">${task.priority}</span>
              ${deadlineBadge}
            </div>

            <h3 class="task-title">${task.title}</h3>
            ${task.notes ? `<p class="task-desc">${task.notes}</p>` : ''}

            <div class="task-footer">
              <span class="task-deadline ${deadlineClass}">
                <i class="fa-regular fa-clock"></i> Deadline: ${formatIndoDate(task.deadline)}
              </span>
            </div>
          </div>

          <div class="task-actions">
            <button class="btn-icon edit" data-action="edit" data-id="${task.id}" title="Edit Tugas" aria-label="Edit Tugas">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-icon delete" data-action="delete" data-id="${task.id}" title="Hapus Tugas" aria-label="Hapus Tugas">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * ============================================================================
   * 8. EVENT LISTENERS
   * ============================================================================
   */
  setupEventListeners() {
    // Tombol Buka Modal Tambah Tugas
    if (this.btnOpenAddModal) {
      this.btnOpenAddModal.addEventListener('click', () => this.openAddModal());
    }

    // Tombol Tutup & Batal Modal
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => this.closeModal());
    }
    if (this.btnCancelTask) {
      this.btnCancelTask.addEventListener('click', () => this.closeModal());
    }

    // Submit Form Tambah / Edit Tugas
    if (this.taskForm) {
      this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Event Delegation untuk Daftar Tugas (Checkbox, Edit, Delete)
    if (this.taskListContainer) {
      this.taskListContainer.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;

        if (action === 'toggle') {
          this.toggleTask(id);
        } else if (action === 'edit') {
          this.openEditModal(id);
        } else if (action === 'delete') {
          this.deleteTask(id);
        }
      });
    }

    // Filter Tabs (Semua / Belum Selesai / Selesai)
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.filter;
        this.renderTasks();
      });
    });

    // Pencarian Tugas
    if (this.taskSearchInput) {
      this.taskSearchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderTasks();
      });
    }

    // Perbarui Kutipan Inspirasi
    if (this.refreshQuoteBtn) {
      this.refreshQuoteBtn.addEventListener('click', () => {
        this.fetchDailyQuote();
      });
    }

    // Auto-save Catatan Cepat ke LocalStorage dengan debounce
    if (this.quickNotesArea) {
      let timeoutId = null;
      this.quickNotesArea.addEventListener('input', (e) => {
        if (this.noteSaveStatus) {
          this.noteSaveStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.saveNotesToStorage(e.target.value);
        }, 500);
      });
    }

    // Tutup dialog saat klik backdrop di luar area modal
    if (this.taskModal) {
      this.taskModal.addEventListener('click', (e) => {
        const rect = this.taskModal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          this.closeModal();
        }
      });
    }
  }
}

/**
 * ==============================================================================
 * 9. INISIALISASI APLIKASI
 * Dijalankan ketika seluruh DOM telah selesai dimuat
 * ==============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new DashboardApp();
  app.init();
});
