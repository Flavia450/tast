/* ==========================================================
   Campus Collective - page behaviour
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ---- 1. Footer year ---- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- 2. Navbar: shadow on scroll ---- */
  const nav = document.getElementById("mainNav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- 3. Close the mobile menu after choosing a link ---- */
  const menu = document.getElementById("navMenu");
  document.querySelectorAll("#navMenu .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---- 4. Highlight the nav link for the section in view ---- */
  const links = [...document.querySelectorAll("#navMenu .nav-link")];
  const targets = links
    .filter(l => l.getAttribute("href").startsWith("#"))   // skip the external "Previous Works" link
    .map(l => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const setActive = () => {
    const y = window.scrollY + 120;          // offset for fixed navbar
    let current = targets[0];
    targets.forEach(t => { if (t.offsetTop <= y) current = t; });
    // the gallery has no nav link, so keep "Members" active while in it
    const gallery = document.getElementById("gallery");
    if (gallery && y >= gallery.offsetTop && y < document.getElementById("about").offsetTop) {
      current = document.getElementById("members");
    }
    links.forEach(l => {
      const active = l.getAttribute("href") === "#" + current.id;
      l.classList.toggle("active", active);
      active ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---- 5. Gallery lightbox: fill the modal with the clicked image ---- */
  const modal = document.getElementById("imageModal");
  modal.addEventListener("show.bs.modal", event => {
    const trigger = event.relatedTarget;
    const img = document.getElementById("modalImage");
    img.src = trigger.dataset.src;
    img.alt = trigger.querySelector("img").alt;
    document.getElementById("imageModalLabel").textContent = trigger.dataset.caption;
  });

  /* ---- 6. Contact form: Bootstrap validation + success message ---- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", event => {
    event.preventDefault();                  // no server, so we handle submit here
    success.classList.add("d-none");

    // Trim text fields so spaces alone do not count as input
    ["fullName", "message"].forEach(id => {
      const field = document.getElementById(id);
      field.value = field.value.trim();
    });

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      form.querySelector(":invalid").focus();   // move focus to first error
      return;
    }

    // Valid: show confirmation and reset the form
    document.getElementById("successName").textContent =
      document.getElementById("fullName").value;
    form.reset();
    form.classList.remove("was-validated");
    success.classList.remove("d-none");
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});
