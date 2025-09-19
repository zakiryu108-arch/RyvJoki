document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const produkList = document.getElementById("produkList");
  const produkItems = produkList ? produkList.querySelectorAll(".produk-item") : [];
  const carousel = document.getElementById("carouselExample");
  const resultMessage = document.getElementById("resultMessage");

  // Fungsi filter utama
  function filterProducts(rawKeyword) {
    const keyword = (rawKeyword || "").toLowerCase().trim();
    const terms = keyword.split(/\s+/).filter(Boolean); // kata per kata
    let foundAny = false;

    produkItems.forEach(item => {
      const name = (item.dataset.nama || "").toLowerCase();
      const keywords = (item.dataset.keywords || "").toLowerCase();
      const title = (item.querySelector(".card-title")?.textContent || "").toLowerCase();
      const text = (item.querySelector(".card-text")?.textContent || "").toLowerCase();

      // Jika tidak ada kata pencarian -> tampilkan semua
      if (terms.length === 0) {
        item.classList.remove("d-none");
        foundAny = true;
        return;
      }

      // Pencarian: setiap term harus ada di salah satu sumber (AND search).
      const matchesAll = terms.every(term => {
        return name.includes(term) || keywords.includes(term) || title.includes(term) || text.includes(term);
      });

      if (matchesAll) {
        item.classList.remove("d-none");
        foundAny = true;
      } else {
        item.classList.add("d-none");
      }
    });

    // Hide/show carousel
    if (carousel) {
      if (terms.length > 0) carousel.classList.add("d-none");
      else carousel.classList.remove("d-none");
    }

    // Tampilkan pesan hasil
    if (!foundAny && terms.length > 0) {
      resultMessage.innerHTML = `<div class="alert alert-warning">Produk tidak ditemukan untuk "<strong>${escapeHtml(keyword)}</strong>"</div>`;
    } else {
      resultMessage.innerHTML = ""; // kosongkan pesan
    }
  }

  // helper untuk menghindari XSS jika kamu menampilkan keyword
  function escapeHtml(str) {
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }

  // Live search saat mengetik
  input.addEventListener("input", (e) => {
    filterProducts(e.target.value);
  });

  // Tombol search (fallback)
  searchBtn.addEventListener("click", () => {
    filterProducts(input.value);
  });

  // Tombol clear: kosongkan input & tampilkan semua
  clearBtn.addEventListener("click", () => {
    input.value = "";
    filterProducts("");
    input.focus();
  });

  // Inisialisasi: tampilkan semua
  filterProducts("");
});
