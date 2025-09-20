document.addEventListener("DOMContentLoaded", () => {
  // cari form & input di navbar (cocok untuk html yang kamu kirim)
  const navbarForm = document.querySelector('nav form[role="search"]');
  const input = navbarForm ? navbarForm.querySelector('input[type="search"]') : null;
  const searchBtn = navbarForm ? navbarForm.querySelector('button[type="submit"]') : null;

  const produkList = document.getElementById("produkList");
  const produkItems = produkList ? produkList.querySelectorAll(".produk-item") : [];
  const carousel = document.getElementById("carouselExample");
  const resultMessage = document.getElementById("resultMessage");

  // safety: jika elemen tidak ditemukan, hentikan dengan pesan di console
  if (!navbarForm || !input || produkItems.length === 0) {
    console.warn("script.js: navbar form / input / produk tidak lengkap. Periksa HTML.");
    return;
  }

  // fungsi filtering
  function filterProducts(rawKeyword) {
    const keyword = (rawKeyword || "").toLowerCase().trim();
    const terms = keyword.split(/\s+/).filter(Boolean);
    let foundAny = false;

    produkItems.forEach(item => {
      const name = (item.dataset.nama || "").toLowerCase();
      const keywords = (item.dataset.keywords || "").toLowerCase();
      const title = (item.querySelector(".card-title")?.textContent || "").toLowerCase();
      const text = (item.querySelector(".card-text")?.textContent || "").toLowerCase();

      if (terms.length === 0) {
        item.classList.remove("d-none");
        foundAny = true;
        return;
      }

      // setiap term harus match (AND). Kalau mau OR, ganti .every -> .some
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

    // sembunyikan / tampilkan carousel
    if (carousel) {
      if (terms.length > 0) carousel.classList.add("d-none");
      else carousel.classList.remove("d-none");
    }

    // tampilkan pesan hasil
    if (!foundAny && terms.length > 0) {
      resultMessage.innerHTML = `<div class="alert alert-warning">Produk tidak ditemukan untuk "<strong>${escapeHtml(keyword)}</strong>"</div>`;
    } else {
      resultMessage.innerHTML = "";
    }
  }

  // helper escape
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

  // Tangani submit tombol Search (prevent reload)
  navbarForm.addEventListener("submit", (e) => {
    e.preventDefault();
    filterProducts(input.value);
  });

  // keyboard: Esc untuk clear cepat
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      filterProducts("");
    }
  });

  // inisialisasi: tampilkan semua
  filterProducts("");
});
