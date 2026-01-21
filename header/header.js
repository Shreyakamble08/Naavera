console.log("[header.js] Script started – beginning fetch for header/header.html");

fetch("header/header.html")
  .then((res) => {
    console.log("[fetch] Response received – status:", res.status);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then((html) => {
    console.log("[fetch] HTML content received – length:", html.length, "characters");

    const headerPlaceholder = document.getElementById("header");
    if (!headerPlaceholder) {
      console.error("[fetch] Critical: <div id=\"header\"> placeholder NOT found in DOM");
      return;
    }

    headerPlaceholder.innerHTML = html;
    console.log("[fetch] Header HTML inserted into #header");

    // 1. Element Selection + logging
    console.log("[selection] Looking up core mobile elements...");
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("drawer-backdrop");
    const mobileClose = document.getElementById("mobile-close");
    const mobileDropdownToggles = document.querySelectorAll(".mobile-dropdown-toggle");
    const subcategoryToggles = document.querySelectorAll(".subcategory-toggle");

    console.log("[selection] Results:", {
      hamburger: !!hamburger,
      mobileMenu: !!mobileMenu,
      backdrop: !!backdrop,
      mobileClose: !!mobileClose,
      mainToggles: mobileDropdownToggles.length,
      subcategoryToggles: subcategoryToggles.length
    });

    if (subcategoryToggles.length === 0) {
      console.warn("[selection] WARNING: No .subcategory-toggle elements found after header insert");
    }

    // 2. Optimized Close Function
    function closeDrawer() {
      console.log("[closeDrawer] Called");
      if (!mobileMenu) {
        console.warn("[closeDrawer] mobileMenu missing – aborting");
        return;
      }

      hamburger?.classList.remove("open");
      mobileMenu.classList.remove("show");
      backdrop?.classList.remove("show");
      document.body.style.overflow = "";

      mobileDropdownToggles.forEach((toggle, i) => {
        const dd = toggle.nextElementSibling;
        const icon = toggle.querySelector("svg");
        if (dd) {
          dd.classList.remove("show");
          console.log(`[closeDrawer] Reset main dropdown #${i+1}`);
        }
        if (icon) icon.style.transform = "rotate(0deg)";
      });

      // Also reset subcategories
      subcategoryToggles.forEach((toggle, i) => {
        const list = toggle.nextElementSibling;
        const icon = toggle.querySelector("svg");
        if (list) {
          list.classList.add("hidden");
          console.log(`[closeDrawer] Reset subcategory #${i+1}`);
        }
        if (icon) icon.style.transform = "rotate(0deg)";
      });

      console.log("[closeDrawer] Drawer fully closed + resets done");
    }

    // 3. Hamburger Toggle Logic
    if (hamburger && mobileMenu) {
      console.log("[hamburger] Attaching click listener");
      hamburger.addEventListener("click", function (e) {
        console.log("[hamburger] Click detected");
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("show");
        this.classList.toggle("open");
        backdrop?.classList.toggle("show");
        document.body.style.overflow = isOpen ? "hidden" : "";
        console.log("[hamburger] Menu toggled to:", isOpen ? "OPEN" : "CLOSED");
      });
    } else {
      console.warn("[hamburger] Cannot attach listener – missing hamburger or mobileMenu");
    }

    // 4. Backdrop & Close Button
    if (mobileClose) {
      console.log("[mobileClose] Attaching click listener");
      mobileClose.addEventListener("click", () => {
        console.log("[mobileClose] Click → closing drawer");
        closeDrawer();
      });
    }
    if (backdrop) {
      console.log("[backdrop] Attaching click listener");
      backdrop.addEventListener("click", () => {
        console.log("[backdrop] Click → closing drawer");
        closeDrawer();
      });
    }

    // 5. Main Mobile Dropdown Logic (About / Manufacturing / Materials)
    console.log("[main-dropdowns] Attaching listeners to", mobileDropdownToggles.length, "toggles");
    mobileDropdownToggles.forEach((toggle, i) => {
      console.log(`[main-dropdowns] Attaching click to toggle #${i+1}: ${toggle.textContent.trim().slice(0, 25)}...`);

      toggle.addEventListener("click", function () {
        console.log(`[main-dropdowns] Click on: ${this.textContent.trim().slice(0, 25)}...`);

        const dropdown = this.nextElementSibling;
        const icon = this.querySelector("svg");

        if (!dropdown) {
          console.warn("[main-dropdowns] No sibling dropdown found");
          return;
        }

        const isShowing = dropdown.classList.toggle("show");
        if (icon) {
          icon.style.transform = isShowing ? "rotate(180deg)" : "rotate(0deg)";
        }

        console.log(`[main-dropdowns] Toggled to: ${isShowing ? "OPEN" : "CLOSED"}`);

        // Close others
        mobileDropdownToggles.forEach((other, j) => {
          if (other === this) return;
          const od = other.nextElementSibling;
          const oi = other.querySelector("svg");
          if (od) {
            od.classList.remove("show");
            console.log(`[main-dropdowns] Closed other dropdown #${j+1}`);
          }
          if (oi) oi.style.transform = "rotate(0deg)";
        });
      });
    });

    // Subcategory toggles (Forged Fittings, Buttweld, Flanges) – delegated for reliability
    if (mobileMenu && subcategoryToggles.length > 0) {
      console.log("[subcategory] Attaching delegated click handler to #mobile-menu");

      mobileMenu.addEventListener("click", function (e) {
        const btn = e.target.closest(".subcategory-toggle");
        if (!btn) return;

        console.log("[subcategory] CLICK DETECTED on:", btn.textContent.trim());

        const list = btn.nextElementSibling;
        if (!list || !list.classList.contains("subcategory")) {
          console.warn("[subcategory] No valid subcategory list sibling");
          return;
        }

        const icon = btn.querySelector("svg");

        const nowHidden = list.classList.toggle("hidden");
        if (icon) {
          icon.style.transform = nowHidden ? "rotate(0deg)" : "rotate(180deg)";
        }

        console.log("[subcategory] Toggled to:", nowHidden ? "HIDDEN" : "VISIBLE");

        // Close other subcategories
        subcategoryToggles.forEach((other) => {
          if (other === btn) return;
          const otherList = other.nextElementSibling;
          const otherIcon = other.querySelector("svg");
          if (otherList) otherList.classList.add("hidden");
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        });
      });
    } else {
      console.warn("[subcategory] Skipped attachment – missing mobileMenu or no toggles");
    }

    // 6. Desktop active link
    console.log("[active-link] Setting active nav link");
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    console.log("[active-link] Current page filename:", currentPath);

    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
        console.log("[active-link] Marked active:", href);
      } else {
        link.classList.remove("active");
      }
    });

    // 7. Auto-close on resize
    window.addEventListener("resize", () => {
      console.log("[resize] Window resized – width:", window.innerWidth);
      if (window.innerWidth >= 1024) {
        console.log("[resize] Desktop breakpoint → closing drawer");
        closeDrawer();
      }
    });

    // 8. Smooth scroll anchors
    console.log("[smooth-scroll] Attaching smooth scroll to", document.querySelectorAll('a[href^="#"]').length, "anchors");
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          console.log("[smooth-scroll] Scrolling to:", targetId);
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 100,
            behavior: "smooth",
          });
          closeDrawer();
        }
      });
    });

    console.log("[header.js] All setup complete – waiting for user interaction");
  })
  .catch((err) => {
    console.error("[fetch] Header load FAILED:", err.message);
  });