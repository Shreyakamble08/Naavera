fetch("header/header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;

    // 1. Element Selection
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("drawer-backdrop");
    const mobileClose = document.getElementById("mobile-close");
    const mobileDropdownToggles = document.querySelectorAll(
      ".mobile-dropdown-toggle"
    );
    const dropdownContainers = document.querySelectorAll(".dropdown-container");

    // 2. Optimized Close Function
    function closeDrawer() {
      if (!mobileMenu) return;
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("show");
      backdrop.classList.remove("show");
      document.body.style.overflow = "";

      // Reset mobile dropdowns and their icons
      mobileDropdownToggles.forEach((toggle) => {
        const dd = toggle.nextElementSibling;
        const icon = toggle.querySelector("svg");
        if (dd) dd.classList.remove("show");
        if (icon) icon.style.transform = "rotate(0deg)";
      });
    }

    // 3. Hamburger Toggle Logic
    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", function (e) {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle("show");
        this.classList.toggle("open");
        backdrop.classList.toggle("show");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
    }

    // 4. Backdrop & Close Button
    if (mobileClose) mobileClose.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    // 5. Updated Mobile Dropdown Logic (with Icon Rotation)
    mobileDropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const dropdown = this.nextElementSibling;
        const icon = this.querySelector("svg");

        // Toggle current
        const isShowing = dropdown.classList.toggle("show");
        if (icon)
          icon.style.transform = isShowing ? "rotate(180deg)" : "rotate(0deg)";

        // Close others (Accordion effect)
        mobileDropdownToggles.forEach((other) => {
          if (other !== this) {
            const od = other.nextElementSibling;
            const oi = other.querySelector("svg");
            if (od) od.classList.remove("show");
            if (oi) oi.style.transform = "rotate(0deg)";
          }
        });
      });
    });

    // 6. Desktop Interaction Fix
    // Since CSS handles hover, we only need JS for link active states
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // 7. Auto-close on Resize
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeDrawer();
    });

    // 8. Smooth Scroll (Matches the top-4 fixed offset)
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          // Offset of 100px to account for the fixed header + margin
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          });
          closeDrawer();
        }
      });
    });
  })
  .catch((err) => console.error("Header load error:", err));
