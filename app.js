// AT Mobile Pricing Directory Controller Logic

document.addEventListener("DOMContentLoaded", () => {
  // Global State
  let phones = [];
  let currentSection = "selling-prices-section";
  
  // Selected phone model for repair viewing
  let selectedRepairPhoneId = null;
  
  // DOM Elements - Navigation
  const navTabBtns = document.querySelectorAll(".nav-tab-btn");
  const sections = document.querySelectorAll(".content-section");
  
  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  
  // Selling Prices Elements
  const phoneSearchInput = document.getElementById("phone-search-input");
  const brandFilter = document.getElementById("brand-filter");
  const storageFilter = document.getElementById("storage-filter");
  const deviceListHorizontal = document.getElementById("device-list-horizontal");
  
  // Repair Service Elements
  const repairDeviceSelect = document.getElementById("repair-device-select");
  const activeRepairModelTitle = document.getElementById("active-repair-model-title");
  const repairItemsTbody = document.getElementById("repair-items-tbody");
  const btnEditActiveRepairDevice = document.getElementById("btn-edit-active-repair-device");
  
  // Admin Data Management Elements
  const btnResetDb = document.getElementById("btn-reset-db");
  const btnAddDevice = document.getElementById("btn-add-device");
  const adminPhonesTbody = document.getElementById("admin-phones-tbody");
  
  // Phone Form Modal Elements
  const phoneModal = document.getElementById("phone-modal");
  const btnClosePhoneModal = document.getElementById("btn-close-phone-modal");
  const btnCancelPhoneModal = document.getElementById("btn-cancel-phone-modal");
  const phoneForm = document.getElementById("phone-form");
  const modalTitle = document.getElementById("modal-title");
  const formPhoneId = document.getElementById("form-phone-id");
  const formBrand = document.getElementById("form-brand");
  const formModel = document.getElementById("form-model");
  const formColor = document.getElementById("form-color");
  const formColorText = document.getElementById("form-color-text");
  const formCapacitiesContainer = document.getElementById("form-capacities-container");
  const btnAddFormCapacity = document.getElementById("btn-add-form-capacity");
  const repairModalBody = document.getElementById("repair-modal-body");

  // Repair Form Modal Elements
  const repairModal = document.getElementById("repair-modal");
  const btnCloseRepairModal = document.getElementById("btn-close-repair-modal");
  const btnCancelRepairModal = document.getElementById("btn-cancel-repair-modal");
  const repairForm = document.getElementById("repair-form");
  const repairModalTitle = document.getElementById("repair-modal-title");
  const formRepairPhoneId = document.getElementById("form-repair-phone-id");

  // Navigation Logic
  navTabBtns.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const targetSectionId = btn.getAttribute("data-target");
      
      navTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      sections.forEach(sec => {
        sec.style.display = sec.id === targetSectionId ? "block" : "none";
      });
      
      currentSection = targetSectionId;
      
      // Trigger appropriate renderers
      if (targetSectionId === "selling-prices-section") {
        await renderSellingPrices();
      } else if (targetSectionId === "repair-prices-section") {
        await renderRepairServiceScreen();
      } else if (targetSectionId === "data-management-section") {
        await renderAdminScreen();
      }
    });
  });

  // Theme Toggle Logic
  function updateThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('at_mobile_theme', newTheme);
    updateThemeUI(newTheme);
  });

  // Load initial theme state
  const savedTheme = localStorage.getItem('at_mobile_theme') || 'dark';
  updateThemeUI(savedTheme);

  // Synchronize color values in Form
  formColor.addEventListener("input", (e) => {
    formColorText.value = e.target.value;
  });
  formColorText.addEventListener("input", (e) => {
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      formColor.value = e.target.value;
    }
  });

  // Capacity forms manager helper
  function addFormCapacityInput(capacity = "", newPrice = "", usedPrice = "", buyPrice = "") {
    const capacityDiv = document.createElement("div");
    capacityDiv.className = "capacity-item-form";
    capacityDiv.innerHTML = `
      <div class="capacity-header-form">
        <span>ความจุย่อย</span>
        <button type="button" class="remove-form-item-btn"><i class="fa-solid fa-trash"></i> ลบ</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>ความจุ *</label>
          <input type="text" class="form-input cap-val" required placeholder="ความจุ" value="${capacity}">
        </div>
        <div class="form-group">
          <label>ราคาใหม่ (บาท) *</label>
          <input type="number" class="form-input cap-new" required min="0" placeholder="ใหม่" value="${newPrice}">
        </div>
      </div>
      <div class="form-row" style="margin-bottom: 0;">
        <div class="form-group">
          <label>ขายมือสอง (บาท) *</label>
          <input type="number" class="form-input cap-used" required min="0" placeholder="มือสอง" value="${usedPrice}">
        </div>
        <div class="form-group">
          <label>ราคารับซื้อ (บาท) *</label>
          <input type="number" class="form-input cap-buy" required min="0" placeholder="รับซื้อ" value="${buyPrice}">
        </div>
      </div>
    `;
    
    capacityDiv.querySelector(".remove-form-item-btn").addEventListener("click", () => {
      capacityDiv.remove();
    });
    
    formCapacitiesContainer.appendChild(capacityDiv);
  }

  btnAddFormCapacity.addEventListener("click", () => {
    addFormCapacityInput();
  });

  // Format money helper
  function formatMoney(amount) {
    return Number(amount).toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  // Render Section 1: Selling Prices Catalog in Horizontal Layout
  async function renderSellingPrices() {
    phones = await Database.getPhones();
    deviceListHorizontal.innerHTML = "";
    
    const searchVal = phoneSearchInput.value.toLowerCase().trim();
    const brandVal = brandFilter.value;
    const storageVal = storageFilter.value;

    const filtered = phones.filter(phone => {
      // Brand filter
      if (brandVal !== "all" && phone.brand !== brandVal) return false;
      
      // Search filter
      const matchesSearch = phone.brand.toLowerCase().includes(searchVal) || 
                            phone.model.toLowerCase().includes(searchVal);
      if (!matchesSearch) return false;
      
      // Storage filter
      if (storageVal !== "all") {
        const hasStorage = phone.sellingPrices.some(sp => sp.capacity === storageVal);
        if (!hasStorage) return false;
      }
      
      return true;
    });

    if (filtered.length === 0) {
      deviceListHorizontal.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; margin-bottom: 12px; color: var(--text-tertiary);"></i>
          <p>ไม่พบข้อมูลรุ่นโทรศัพท์ที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      `;
      return;
    }

    filtered.forEach(phone => {
      const row = document.createElement("div");
      row.className = "device-row-horizontal";
      row.style.setProperty('--brand-color', phone.color || '#06b6d4');
      
      let priceRowsHTML = "";
      
      // Filter list of prices inside target if storage filter selected
      const displayPrices = storageVal === "all" ? 
                            phone.sellingPrices : 
                            phone.sellingPrices.filter(sp => sp.capacity === storageVal);

      displayPrices.forEach(sp => {
        let trendClass = 'stable';
        if (sp.trend === 'up') trendClass = 'up';
        else if (sp.trend === 'down') trendClass = 'down';

        priceRowsHTML += `
          <div class="price-row-minimal">
            <span class="chip-capacity">${sp.capacity}</span>
            <span class="chip-divider"></span>
            <div class="price-pair-minimal new">
              <span class="lbl">ใหม่</span>
              <span class="val">${formatMoney(sp.newPrice)}</span>
            </div>
            <span class="chip-divider"></span>
            <div class="price-pair-minimal used">
              <span class="lbl">มือสอง</span>
              <span class="val">${formatMoney(sp.usedPrice)}</span>
            </div>
            <span class="chip-divider"></span>
            <div class="price-pair-minimal buy">
              <span class="lbl">รับซื้อ</span>
              <span class="val">${formatMoney(sp.buyPrice || 0)}</span>
            </div>
            <span class="trend-container">
              <span class="trend-dot ${trendClass}" title="แนวโน้มราคา: ${sp.trend === 'up' ? 'ขึ้น' : sp.trend === 'down' ? 'ลง' : 'คงที่'}"></span>
            </span>
          </div>
        `;
      });

      row.innerHTML = `
        <div class="device-info">
          <span class="device-brand">${phone.brand}</span>
          <span class="device-model">${phone.model}</span>
        </div>
        <div class="device-prices-horizontal">
          ${priceRowsHTML}
        </div>
        <div class="device-actions">
          <span class="device-action-link" data-id="${phone.id}">
            ดูอัตราค่าซ่อม <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          </span>
        </div>
      `;

      // Event listener to switch directly to repairs
      row.querySelector(".device-action-link").addEventListener("click", () => {
        selectedRepairPhoneId = phone.id;
        
        // Find corresponding link in tab nav and click it
        const repairTabBtn = Array.from(navTabBtns).find(btn => btn.getAttribute("data-target") === "repair-prices-section");
        if (repairTabBtn) {
          repairTabBtn.click();
        }
      });

      deviceListHorizontal.appendChild(row);
    });
  }

  // Filter Event Listeners
  phoneSearchInput.addEventListener("input", renderSellingPrices);
  brandFilter.addEventListener("change", renderSellingPrices);
  storageFilter.addEventListener("change", renderSellingPrices);

  // Render Section 2: Repair Service Pricing
  async function renderRepairServiceScreen() {
    phones = await Database.getPhones();
    
    // Populate select device option dropdown
    repairDeviceSelect.innerHTML = "";
    phones.forEach(phone => {
      const opt = document.createElement("option");
      opt.value = phone.id;
      opt.textContent = `[${phone.brand}] ${phone.model}`;
      if (phone.id === selectedRepairPhoneId) {
        opt.selected = true;
      }
      repairDeviceSelect.appendChild(opt);
    });

    const activePhone = phones.find(p => p.id === selectedRepairPhoneId);
    if (!activePhone) {
      repairItemsTbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 30px; color: var(--text-secondary);">
            กรุณาเลือกรุ่นโทรศัพท์จากตัวเลือกด้านบน
          </td>
        </tr>
      `;
      activeRepairModelTitle.textContent = "ตารางราคาซ่อม";
      if (btnEditActiveRepairDevice) {
        btnEditActiveRepairDevice.style.display = "none";
      }
      return;
    }

    // Update repair card title
    activeRepairModelTitle.textContent = `รายการราคาซ่อมบริการสำหรับ: ${activePhone.model}`;

    // Update edit button visibility and action
    if (btnEditActiveRepairDevice) {
      btnEditActiveRepairDevice.style.display = "inline-flex";
      btnEditActiveRepairDevice.onclick = (e) => {
        e.preventDefault();
        openRepairModal(activePhone);
      };
    }

    // Render repairs table
    repairItemsTbody.innerHTML = "";
    
    if (activePhone.repairs.length === 0) {
      repairItemsTbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 30px; color: var(--text-secondary);">
            ยังไม่มีข้อมูลอัตราบริการซ่อมสำหรับรุ่นนี้
          </td>
        </tr>
      `;
      return;
    }

    activePhone.repairs.forEach((rep) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="font-weight: 500; color: var(--text-primary);">${rep.name}</div>
        </td>
        <td><span class="time-badge"><i class="fa-regular fa-clock"></i> ${rep.time}</span></td>
        <td><span class="warranty-badge"><i class="fa-solid fa-shield"></i> ${rep.warranty}</span></td>
        <td style="text-align: right;" class="repair-price-text">${formatMoney(rep.price)}</td>
      `;
      repairItemsTbody.appendChild(tr);
    });
  }

  // Device select changes refresh the repair screen
  repairDeviceSelect.addEventListener("change", async (e) => {
    selectedRepairPhoneId = e.target.value;
    await renderRepairServiceScreen();
  });

  // Render Section 3: Data Management (Admin)
  async function renderAdminScreen() {
    phones = await Database.getPhones();
    adminPhonesTbody.innerHTML = "";

    phones.forEach(phone => {
      const tr = document.createElement("tr");
      
      // Calculate average repair price
      let totalRepairCost = 0;
      phone.repairs.forEach(r => totalRepairCost += r.price);
      const avgRepair = phone.repairs.length > 0 ? Math.round(totalRepairCost / phone.repairs.length) : 0;
      
      // Starting sell price
      let startingPrice = 0;
      if (phone.sellingPrices.length > 0) {
        startingPrice = Math.min(...phone.sellingPrices.map(sp => sp.newPrice));
      }

      tr.innerHTML = `
        <td>
          <div class="admin-device-row">
            <div class="brand-dot" style="background-color: ${phone.color || '#00b4d8'}"></div>
            <span style="font-weight: 600;">${phone.brand}</span>
          </div>
        </td>
        <td><div style="font-weight: 500;">${phone.model}</div></td>
        <td>${startingPrice > 0 ? formatMoney(startingPrice) : "-"}</td>
        <td>~ ${avgRepair > 0 ? formatMoney(avgRepair) : "-"}</td>
        <td>
          <div class="action-buttons-cell">
            <button class="btn-icon edit-device" data-id="${phone.id}" title="แก้ไขข้อมูลเครื่อง"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="btn-icon edit-repair" data-id="${phone.id}" title="แก้ไขรายละเอียดงานซ่อม"><i class="fa-solid fa-screwdriver-wrench"></i></button>
            <button class="btn-icon delete" data-id="${phone.id}" title="ลบเครื่อง"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      // Delete listener
      tr.querySelector(".btn-icon.delete").addEventListener("click", async () => {
        if (confirm(`คุณต้องการลบข้อมูลรุ่น "${phone.model}" ใช่หรือไม่?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) {
          await Database.deletePhone(phone.id);
          await renderAdminScreen();
        }
      });

      // Edit Device listener
      tr.querySelector(".btn-icon.edit-device").addEventListener("click", () => {
        openPhoneModal(phone);
      });

      // Edit Repair listener
      tr.querySelector(".btn-icon.edit-repair").addEventListener("click", () => {
        openRepairModal(phone);
      });

      adminPhonesTbody.appendChild(tr);
    });
  }

  // Restore Default Seeds
  btnResetDb.addEventListener("click", async () => {
    if (confirm("ต้องการกู้คืนข้อมูลราคาขายและซ่อมทั้งหมดกลับไปเป็นค่าตั้งต้นใช่หรือไม่?\nการเปลี่ยนแปลงหลังร้านที่คุณทำไว้จะสูญหาย")) {
      phones = await Database.resetDatabase();
      await renderAdminScreen();
      alert("กู้คืนข้อมูลเรียบร้อยแล้ว");
    }
  });

  // Modal form management
  function openPhoneModal(phoneToEdit = null) {
    formCapacitiesContainer.innerHTML = "";
    
    if (phoneToEdit) {
      modalTitle.textContent = `แก้ไขข้อมูลเครื่อง: ${phoneToEdit.model}`;
      formPhoneId.value = phoneToEdit.id;
      formBrand.value = phoneToEdit.brand;
      formModel.value = phoneToEdit.model;
      
      const themeColor = phoneToEdit.color || "#06b6d4";
      formColor.value = themeColor;
      formColorText.value = themeColor;

      // Populate capacities
      phoneToEdit.sellingPrices.forEach(sp => {
        addFormCapacityInput(sp.capacity, sp.newPrice, sp.usedPrice, sp.buyPrice || "");
      });
    } else {
      modalTitle.textContent = "เพิ่มโทรศัพท์รุ่นใหม่";
      formPhoneId.value = "";
      formBrand.value = "Apple";
      formModel.value = "";
      formColor.value = "#06b6d4";
      formColorText.value = "#06b6d4";
      
      // Seed default capacity rows for convenience
      addFormCapacityInput("128GB", "", "");
      addFormCapacityInput("256GB", "", "");
    }

    phoneModal.classList.add("active");
  }

  btnAddDevice.addEventListener("click", () => openPhoneModal(null));

  function closePhoneModal() {
    phoneModal.classList.remove("active");
    phoneForm.reset();
  }

  btnClosePhoneModal.addEventListener("click", closePhoneModal);
  btnCancelPhoneModal.addEventListener("click", closePhoneModal);

  // Submit phone form edit/add
  phoneForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const brand = formBrand.value;
    const model = formModel.value.trim();
    const color = formColor.value;
    
    // Parse capacity lines
    const capacityItems = [];
    const capacityBlocks = formCapacitiesContainer.querySelectorAll(".capacity-item-form");
    capacityBlocks.forEach(block => {
      const capVal = block.querySelector(".cap-val").value.trim();
      const capNew = parseInt(block.querySelector(".cap-new").value) || 0;
      const capUsed = parseInt(block.querySelector(".cap-used").value) || 0;
      const capBuy = parseInt(block.querySelector(".cap-buy").value) || 0;
      if (capVal) {
        capacityItems.push({ capacity: capVal, newPrice: capNew, usedPrice: capUsed, buyPrice: capBuy, trend: "stable" });
      }
    });

    const targetId = formPhoneId.value;
    if (targetId) {
      // Update Mode
      await Database.updatePhone(targetId, {
        brand,
        model,
        color,
        sellingPrices: capacityItems
      });
    } else {
      // Add Mode (Seed default empty repairs)
      const repairsList = [
        { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 0, time: "2-3 ชม.", warranty: "90 วัน" },
        { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 0, time: "1-2 ชม.", warranty: "180 วัน" },
        { type: "motherboard", name: "ซ่อมบอร์ดหลัก/เปิดไม่ติด (Motherboard)", price: 0, time: "1-2 วัน", warranty: "90 วัน" },
        { type: "charging", name: "เปลี่ยนแพตูดชาร์จ (Charging Port)", price: 0, time: "1 ชม.", warranty: "90 วัน" }
      ];

      await Database.addPhone({
        brand,
        model,
        color,
        sellingPrices: capacityItems,
        repairs: repairsList
      });
    }

    closePhoneModal();
    phones = await Database.getPhones();

    // Re-render active section
    if (currentSection === "selling-prices-section") {
      await renderSellingPrices();
    } else if (currentSection === "repair-prices-section") {
      await renderRepairServiceScreen();
    } else if (currentSection === "data-management-section") {
      await renderAdminScreen();
    }
  });

  // Repair Modal Management
  function openRepairModal(phoneToEdit) {
    if (!phoneToEdit) return;
    
    repairModalTitle.textContent = `ราคาและรายละเอียดงานซ่อม: ${phoneToEdit.model}`;
    formRepairPhoneId.value = phoneToEdit.id;
    
    // Clear and build the dynamic repair fields inside repairModalBody
    repairModalBody.innerHTML = "";
    
    if (phoneToEdit.repairs && phoneToEdit.repairs.length > 0) {
      phoneToEdit.repairs.forEach((rep) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "repair-form-group";
        itemDiv.style.marginBottom = "16px";
        itemDiv.setAttribute("data-type", rep.type || "");
        itemDiv.setAttribute("data-name", rep.name || "");
        
        itemDiv.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 6px; font-size: 0.85rem; color: var(--text-secondary);">${rep.name}</div>
          <div class="form-row three-cols">
            <div>
              <label style="font-size: 0.72rem; color: var(--text-tertiary);">ราคา (฿) *</label>
              <input type="number" class="form-input rep-price" required min="0" placeholder="ราคา" value="${rep.price !== undefined ? rep.price : 0}">
            </div>
            <div>
              <label style="font-size: 0.72rem; color: var(--text-tertiary);">ระยะเวลาดำเนินงาน *</label>
              <input type="text" class="form-input rep-time" required placeholder="เช่น 2 ชม." value="${rep.time || '1 ชม.'}">
            </div>
            <div>
              <label style="font-size: 0.72rem; color: var(--text-tertiary);">รับประกัน *</label>
              <input type="text" class="form-input rep-warranty" required placeholder="เช่น 90 วัน" value="${rep.warranty || '90 วัน'}">
            </div>
          </div>
        `;
        repairModalBody.appendChild(itemDiv);
      });
    } else {
      repairModalBody.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
          ไม่มีรายการบริการซ่อมสำหรับโทรศัพท์รุ่นนี้
        </div>
      `;
    }

    repairModal.classList.add("active");
  }

  function closeRepairModal() {
    repairModal.classList.remove("active");
    repairModalBody.innerHTML = "";
  }

  btnCloseRepairModal.addEventListener("click", closeRepairModal);
  btnCancelRepairModal.addEventListener("click", closeRepairModal);

  // Submit repair form
  repairForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const targetId = formRepairPhoneId.value;
    if (!targetId) return;

    const finalRepairs = [];
    const repairGroups = repairModalBody.querySelectorAll(".repair-form-group");
    
    repairGroups.forEach(group => {
      const type = group.getAttribute("data-type");
      const name = group.getAttribute("data-name");
      const price = parseInt(group.querySelector(".rep-price").value) || 0;
      const time = group.querySelector(".rep-time").value.trim();
      const warranty = group.querySelector(".rep-warranty").value.trim();
      
      finalRepairs.push({
        type: type,
        name: name,
        price: price,
        time: time,
        warranty: warranty
      });
    });

    await Database.updatePhone(targetId, {
      repairs: finalRepairs
    });

    closeRepairModal();
    phones = await Database.getPhones();

    // Re-render active section
    if (currentSection === "selling-prices-section") {
      await renderSellingPrices();
    } else if (currentSection === "repair-prices-section") {
      await renderRepairServiceScreen();
    } else if (currentSection === "data-management-section") {
      await renderAdminScreen();
    }
  });

  // Initialize First Screen: Selling Prices
  async function init() {
    phones = await Database.getPhones();
    if (phones.length > 0) {
      selectedRepairPhoneId = phones[0].id;
    }
    await renderSellingPrices();
  }
  init();
});
