// -------- Tab Menu --------
const tabsButtons = document.querySelectorAll("*[data-tab-header]");
const tabUnderline = document.querySelector(".tab-underline");

tabsButtons.forEach((tabButton) => {
  tabButton.addEventListener("click", () => {
    const selectedTab = tabButton.dataset.tabHeader;
    const selectedTabEl = document.querySelector(
      `*[data-tab="${selectedTab}"]`
    );
    const currentTab = document.querySelector(`*[data-tab].active`);
    const activeTabButton = document.querySelector(".tab-button.active");

    activeTabButton.classList.remove("active");
    tabButton.classList.add("active");

    currentTab.classList.remove("active");
    selectedTabEl.classList.add("active");

    tabUnderline.style.width = tabButton.clientWidth + "px";

    if (tabUnderline.offsetLeft < tabButton.offsetLeft) {
      const translateVal = tabUnderline.offsetLeft + tabButton.offsetLeft;

      tabUnderline.style.transform = `translateX(${translateVal}px)`;
    } else {
      const translateVal = tabUnderline.offsetLeft - tabButton.offsetLeft;

      tabUnderline.style.transform = `translateX(${translateVal}px)`;
    }
  });
});

// -------- Modal --------
function openModal(modalName) {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const modals = document.querySelectorAll("[data-modal]");
  const modal = document.querySelector(`[data-modal="${modalName}"]`);

  modals.forEach((modal) => modal.classList.remove("active"));
  modal.classList.add("active");

  modalWrapper.classList.add("active");
  document.querySelector("body").style.overflow = "hidden";
}

function closeModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const activeModal = document.querySelector(".modal.active");

  modalWrapper.classList.remove("active");
  activeModal.classList.remove("active");
  document.querySelector("body").style.overflowY = "scroll";
}

document.querySelectorAll(".modal-close-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal();
  });
});

document.querySelectorAll("[data-open-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal(btn.dataset.openModal);
  });
});
