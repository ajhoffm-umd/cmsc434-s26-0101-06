(function () {
  const device = document.querySelector(".device");
  if (!device) return;

  let activeInput = null;
  let shiftOn = false;
  let activeMode = "alpha"; // 'alpha' | 'num'

  function isTypingTarget(el) {
    if (!el || el.disabled || el.readOnly) return false;
    if (el.closest && el.closest("[data-no-osk]")) return false;
    const tag = el.tagName;
    if (tag === "TEXTAREA") return true;
    if (tag !== "INPUT") return false;
    const ty = (el.getAttribute("type") || "text").toLowerCase();
    const skip = [
      "hidden",
      "file",
      "checkbox",
      "radio",
      "button",
      "submit",
      "reset",
      "image",
      "range",
      "color",
    ];
    return !skip.includes(ty);
  }

  function prefersNumeric(el) {
    if (!el || el.tagName === "TEXTAREA") return false;
    const ty = (el.getAttribute("type") || "").toLowerCase();
    return ty === "number" || ty === "date";
  }

  function updateBottomOffset() {
    const nav = document.querySelector(".device .navbar");
    const h = nav ? nav.getBoundingClientRect().height : 100;
    panel.style.bottom = Math.round(h) + "px";
  }

  function insertText(text) {
    const input = activeInput;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const val = input.value;
    input.value = val.slice(0, start) + text + val.slice(end);
    const pos = start + text.length;
    input.selectionStart = input.selectionEnd = pos;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function backspace() {
    const input = activeInput;
    if (!input) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const val = input.value;
    if (start !== end) {
      input.value = val.slice(0, start) + val.slice(end);
      input.selectionStart = input.selectionEnd = start;
    } else if (start > 0) {
      input.value = val.slice(0, start - 1) + val.slice(start);
      input.selectionStart = input.selectionEnd = start - 1;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function insertNewline() {
    const input = activeInput;
    if (input && input.tagName === "TEXTAREA") insertText("\n");
  }

  function syncShiftKeys() {
    panel.querySelectorAll(".osk-shift").forEach((btn) => {
      btn.classList.toggle("osk-lit", shiftOn);
    });
  }

  function setMode(mode) {
    activeMode = mode;
    if (alphaBoard) alphaBoard.hidden = mode !== "alpha";
    if (numBoard) numBoard.hidden = mode !== "num";
    if (mode === "alpha") syncShiftKeys();
  }

  function attachModeFor(el) {
    if (prefersNumeric(el)) {
      shiftOn = false;
      setMode("num");
    } else {
      shiftOn = false;
      setMode("alpha");
      syncShiftKeys();
    }
  }

  function show(el) {
    activeInput = el;
    attachModeFor(el);
    updateBottomOffset();
    panel.classList.add("osk-visible");
    panel.setAttribute("aria-hidden", "false");
    device.classList.add("osk-open");
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function hide() {
    panel.classList.remove("osk-visible");
    panel.setAttribute("aria-hidden", "true");
    device.classList.remove("osk-open");
    activeInput = null;
  }

  /* ---- DOM ---- */
  const panel = document.createElement("div");
  panel.className = "osk-panel";
  panel.id = "onscreen-keyboard-panel";
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "On-screen keyboard demonstration");
  panel.setAttribute("aria-hidden", "true");

  const header = document.createElement("div");
  header.className = "osk-header";
  const title = document.createElement("span");
  title.className = "osk-title";
  const hideBtn = document.createElement("button");
  hideBtn.type = "button";
  hideBtn.className = "osk-hide-btn";
  hideBtn.textContent = "Hide";
  hideBtn.addEventListener("click", () => {
    if (activeInput) activeInput.blur();
    hide();
  });
  header.appendChild(title);
  header.appendChild(hideBtn);
  panel.appendChild(header);

  const alphaRowsWrap = document.createElement("div");
  alphaRowsWrap.className = "osk-rows";
  const alphaLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["SH", "z", "x", "c", "v", "b", "n", "m", "BS"],
    ["NUM", "", "SPACE", "ENT"],
  ];

  alphaLayout.forEach((rowDef) => {
    const row = document.createElement("div");
    row.className = "osk-row";
    rowDef.forEach((sym) => {
      if (sym === "") return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "osk-key";
      btn.addEventListener("mousedown", (e) => e.preventDefault());

      if (sym === "SH") {
        btn.classList.add("osk-utility", "osk-shift");
        btn.textContent = "⇧";
        btn.title = "Shift";
        btn.addEventListener("click", () => {
          shiftOn = !shiftOn;
          syncShiftKeys();
        });
      } else if (sym === "BS") {
        btn.classList.add("osk-utility");
        btn.textContent = "⌫";
        btn.title = "Backspace";
        btn.addEventListener("click", backspace);
      } else if (sym === "NUM") {
        btn.classList.add("osk-utility");
        btn.textContent = "123";
        btn.title = "Numbers";
        btn.addEventListener("click", () => {
          shiftOn = false;
          setMode("num");
        });
      } else if (sym === "SPACE") {
        btn.classList.add("osk-xwide");
        btn.textContent = "Space";
        btn.addEventListener("click", () => insertText(" "));
      } else if (sym === "ENT") {
        btn.classList.add("osk-wide", "osk-utility");
        btn.textContent = "Enter";
        btn.addEventListener("click", insertNewline);
      } else {
        btn.textContent = sym;
        btn.addEventListener("click", () => {
          let ch = sym;
          if (shiftOn && /^[a-z]$/.test(sym)) ch = sym.toUpperCase();
          insertText(ch);
          shiftOn = false;
          syncShiftKeys();
        });
      }
      row.appendChild(btn);
    });
    alphaRowsWrap.appendChild(row);
  });

  const numRowsWrap = document.createElement("div");
  numRowsWrap.className = "osk-rows osk-num";
  const numLayout = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["-", ".", "0"],
    ["ABC", "BS", "DONE"],
  ];

  numLayout.forEach((rowDef) => {
    const row = document.createElement("div");
    row.className = "osk-row";
    rowDef.forEach((sym) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "osk-key";
      btn.addEventListener("mousedown", (e) => e.preventDefault());

      if (sym === "ABC") {
        btn.classList.add("osk-utility");
        btn.textContent = "ABC";
        btn.addEventListener("click", () => setMode("alpha"));
      } else if (sym === "BS") {
        btn.classList.add("osk-utility", "osk-wide");
        btn.textContent = "⌫";
        btn.addEventListener("click", backspace);
      } else if (sym === "DONE") {
        btn.classList.add("osk-xwide");
        btn.textContent = "Done";
        btn.addEventListener("click", () => {
          if (activeInput) activeInput.blur();
          hide();
        });
      } else {
        btn.textContent = sym === "." ? "." : sym;
        btn.addEventListener("click", () => insertText(sym));
      }
      row.appendChild(btn);
    });
    numRowsWrap.appendChild(row);
  });

  const alphaBoard = document.createElement("div");
  alphaBoard.appendChild(alphaRowsWrap);

  const numBoard = document.createElement("div");
  numBoard.hidden = true;
  numBoard.appendChild(numRowsWrap);

  panel.appendChild(alphaBoard);
  panel.appendChild(numBoard);

  device.appendChild(panel);

  window.addEventListener(
    "focusin",
    function (ev) {
      const t = ev.target;
      if (!device.contains(t)) return;
      if (isTypingTarget(t)) show(t);
    },
    true
  );

  window.addEventListener(
    "focusout",
    function (ev) {
      const t = ev.target;
      if (!device.contains(t) || !isTypingTarget(t)) return;
      setTimeout(() => {
        const ae = document.activeElement;
        if (ae && device.contains(ae) && isTypingTarget(ae)) show(ae);
        else hide();
      }, 80);
    },
    true
  );

  panel.addEventListener("mousedown", (e) => e.preventDefault());

  window.addEventListener("resize", () => {
    if (panel.classList.contains("osk-visible")) updateBottomOffset();
  });
})();
