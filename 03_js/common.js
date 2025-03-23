document.addEventListener("DOMContentLoaded", () => {
  let deviceType, menuBtn, menuBox, logo, menuItems, columns, mainCategory, subCategory, activeItem, activeSubItem, currentPage;
  let tags = [];
  let isActive = false;
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  const header = document.querySelector("#header")
  const content = document.querySelector("#content")
  const footer = document.querySelector("#footer")

  loadPage("home");

  let prevWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    if (window.innerWidth !== prevWidth) {
      location.reload();
      prevWidth = window.innerWidth;
    }
  });

  function loadPage(page, callback) {
    fetch(`01_html/${page}.html`)
      .then(response => response.text())
      .then(data => {
        content.innerHTML = data;
        // history.pushState({ page }, "", `/${page}.html`);
        window.scrollTo({ top: 0, behavior: "smooth" });
        currentPage = page;

        setDeviceType();
        
        if (currentPage === "home") {
          slideBanner();
          productFilter(["main"]);
          newProductDisplay();
          manualSlide();
        }
        
        if (callback) callback();
      })
  }

  fetch("01_html/header.html")
    .then(response => response.text())
    .then(data => {
      header.innerHTML = data;

      menuBtn = header.querySelector(".menuBtn");
      menuBox = header.querySelector(".menuBox");
      logo = header.querySelector(".logo a");
			menuItems = header.querySelectorAll("#header .menuItem")

      if (deviceType === "Mobile" || deviceType === "Tablet") {
        menuToggleMobile();
        menuActiveMobile();
      } else if (deviceType === "PC") {
        menuActivePC();
      }
      menuReset();
      goHome();
    });

    fetch("01_html/footer.html")
    .then(response => response.text())
    .then(data => {
      footer.innerHTML = data;

      const footerHeight = footer.offsetHeight
      content.style.minHeight = `${windowHeight - footerHeight + 60}px`;
    });

  function setDeviceType() {
    if (windowWidth >= 1025) {
      deviceType = "PC";
      columns = 4;
    } else if (windowWidth >= 768) {
      deviceType = "Tablet";
      columns = 3;
    } else {
      deviceType = "Mobile";
      columns = 2;
    }
  }

  function menuToggleMobile() {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (menuBox.classList.contains("active")) {
        menuBtn.classList.remove("active");
        menuBox.classList.remove("active");
        setTimeout(() => {
          menuReset();
        }, 300);
        scrollUnlock();
      } else {
        menuBtn.classList.add("active");
        menuBox.classList.add("active");
        setTimeout(() => {
          scrollLock();
        }, 300);
      }
    });
  }

  function goHome() {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage("home", () => {
        menuReset();

        if (menuBox.classList.contains("active")) {
          menuBtn.classList.remove("active");
          menuBox.classList.remove("active");
          setTimeout(() => {
            menuReset();
          }, 300);
          scrollUnlock();
        }
      });
    });
  }

  function menuActiveMobile() {
    menuItems.forEach(item => {
      const submenu = item.querySelector(".submenu");
      const anchor = item.querySelector("a");

      if(!anchor.hasListener) {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();

          loadPage("product", () => {
            isActive = true;
            activeItem = item;
            mainCategory = activeItem.textContent;
            subCategory = "";
            tags = [];
            const mainTag = activeItem.querySelector("a").getAttribute("data-tag");
            tags.push(mainTag);
    
            if (submenu) {
              const isActive = item.classList.contains("active");
              
              menuReset();
    
              if (!isActive) {
                item.classList.add("active");
                submenuActive();
                submenu.style.height = `${submenu.querySelectorAll("li").length * 2.5}rem`;
              }
            } else {
              productFilter(tags);
              removeBorder(columns);
              menuReset();
              scrollUnlock();
              item.classList.add("active");
              setTimeout(() => {
                menuBtn.classList.remove("active");
                menuBox.classList.remove("active");
              }, 300);
            }
          });
        });
        anchor.hasListener = true;
      }
    });
  }
  
  function menuActivePC() {
    menuItems.forEach(item => {  

      const anchor = item.querySelector("a");

      anchor.addEventListener("mouseenter", () => {
        submenuActive();
        
        if(activeSubItem) {            
          activeSubItem.classList.add("active");
        }

        const submenu = item.querySelector(".submenu");

        if (submenu) {
          const menuPosition = item.getBoundingClientRect().x;

          submenu.style.paddingLeft = `${menuPosition}px`;
          content.style.paddingTop = `106px`;
        } else {
          content.style.paddingTop = "";
        }

        menuItems.forEach(allMain => {
          allMain.classList.remove("active");
        });
        item.classList.add("active");

        if(!anchor.hasListener) {
          anchor.addEventListener("click", (e) => {
            e.preventDefault();
            loadPage("product", () => {
              isActive = true;
              activeItem = item;
              mainCategory = activeItem.querySelector("a").textContent;
              activeSubItem = "";
              subCategory = "";
        
              tags = [];
        
              const mainTag = activeItem.querySelector("a").getAttribute("data-tag");
              tags.push(mainTag);
        
              productFilter(tags);
              removeBorder(columns);
              submenuActive();
            });
          });
          anchor.hasListener = true;
        }
        
      });

      menuBox.addEventListener("mouseleave", () => {
        content.style.paddingTop = "";

        menuItems.forEach(allMain => {
          allMain.classList.remove("active");
        });
        
        if(isActive) {
          activeItem.classList.add("active");
          submenuActive();
          if (activeItem.querySelector(".submenu")) {
            content.style.paddingTop = `106px`;
            if(activeSubItem) {          
              activeSubItem.classList.add("active");
            }
          }
        } else {
          menuItems.forEach(allMain => {
            allMain.classList.remove("active");
          });
          header.querySelectorAll(".submenu").forEach(allSub => {
            allSub.style.height = "";
          });
        }
      })
    });
  }

  function submenuActive() { 
    const subItems = header.querySelectorAll(".subItem");
  
    subItems.forEach(subItem => {
      subItem.classList.remove("active");

      const anchor = subItem.querySelector("a");

      anchor.addEventListener("mouseenter", () => {
        subItems.forEach(allSub => {
          allSub.classList.remove("active");
        });
        subItem.classList.add("active");
      });

      if(!anchor.hasListener) {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          loadPage("product", () => {
            isActive = true;

            activeItem = e.target.closest(".menuItem");
            mainCategory = activeItem.querySelector("a").textContent;
            activeSubItem = subItem;
            subCategory = activeSubItem.querySelector("a").textContent;
  
            tags = [];
  
            const mainTag = activeItem.querySelector("a").getAttribute("data-tag");
            tags.push(mainTag);
            
            const subTag = e.target.getAttribute("data-tag");
            tags.splice(1, 1);
            tags.push(subTag);
  
            productFilter(tags);
            removeBorder(columns);
            scrollUnlock();
    
            subItems.forEach(item => item.classList.remove("active"));
            subItem.classList.add("active");
            
            setTimeout(() => {
              menuBtn.classList.remove("active");
              menuBox.classList.remove("active");
            }, 300);
          });
        });
        anchor.hasListener = true;
      }
    });
  }

  function menuReset() {
    content.style.paddingTop = "";
    menuBox.querySelectorAll(".submenu").forEach(submenu => {
      submenu.style.height = "";
    });
    menuItems.forEach(item => {
      item.classList.remove("active");
    });
    activeItem = "";
    mainCategory = "";
    activeSubItem = "";
    subCategory = "";
  }
  
  function removeBorder(columns) {
    const productList = content.querySelector(".productList")
    const products = productList.querySelectorAll("li");
    const totalProducts = products.length;
    const remainder = totalProducts % columns;
  
    if (totalProducts == 0) {
      productList.style.borderTop = "none";
      productList.style.borderBottom = "none";
    } else {
      productList.style.borderTop = "";
      productList.style.borderBottom = "";
    }

    products.forEach((product, index) => {
      if (index <= columns) {
        product.style.borderTop = "none";
      }

      if (remainder > 0) {
        if (index >= totalProducts - remainder) {
          product.style.borderBottom = "none";
        }
      } else {
          if (index >= totalProducts - columns) {
            product.style.borderBottom = "none";
          }
      }
    });
  }

  function scrollLock() {
    document.body.style.height = "calc(100vh - 60px)";
    document.body.style.overflowY = "hidden";
  }

  function scrollUnlock() {
    document.body.style.height = "";
    document.body.style.overflowY = "";
  }

  function productFilter(tags, sortOption = "최신순") {
    let filtered = products.filter((product) =>
      tags.every((t) => product.tags.includes(t))
    );
  
    if (sortOption === "최신순") {
      filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (sortOption === "낮은 가격순") {
      filtered.sort((a, b) => parseInt(a.price.replace(/,/g, "")) - parseInt(b.price.replace(/,/g, "")));
    } else if (sortOption === "높은 가격순") {
      filtered.sort((a, b) => parseInt(b.price.replace(/,/g, "")) - parseInt(a.price.replace(/,/g, "")));
    }
  
    productDisplay(filtered);
  }
  
  function productDisplay(filtered) {
    if (currentPage === "product") {
      sortItem(tags);

      content.querySelector(".mainCategory").innerHTML = mainCategory;
      content.querySelector(".subCategory").innerHTML = subCategory;
    }

    const productList = content.querySelector(".productList");

    productList.innerHTML = "";
    filtered.forEach(product => {
      const li = document.createElement("li");
      li.setAttribute("data-id", product.id);
  
      li.innerHTML = `
        <a href="#">
          <img src="${product.mainImg}" alt="${product.name} 썸네일">
          <div class="tag">
            <span class="name">${product.name}</span>
            <span class="price">${product.price}원</span>
          </div>
        </a>
      `;

      productList.appendChild(li);

      itemDisplay();
    });
  }

  function newProductDisplay() {
    const newProduct = content.querySelector(".newProduct");
    const productList = newProduct.querySelector(".productList");

    let latestProducts = products
      .sort((a, b) => parseInt(b.id) - parseInt(a.id))
      .slice(0, 5);
  
    productList.innerHTML = "";
    latestProducts.forEach(product => {
      const li = document.createElement("li");
      li.setAttribute("data-id", product.id);
  
      li.innerHTML = `
        <a href="#">
          <img src="${product.mainImg}" alt="${product.name} 썸네일">
          <div class="tag">
            <span class="name">${product.name}</span>
            <span class="price">${product.price}원</span>
          </div>
        </a>
      `;
  
      productList.appendChild(li);
    });
  
    itemDisplay();
  }
  

  function sortItem(tags) {
    const selectBox = content.querySelector(".selectBox");
    const selected = selectBox.querySelector(".selected");
    const optionContainer = selectBox.querySelector(".optionContainer");
    const options = selectBox.querySelectorAll(".option");
  
    if(!selected.hasListener) {
      selected.addEventListener("click", () => {
        optionContainer.style.display = optionContainer.style.display === "flex" ? "none" : "flex";
      });
      selected.hasListener = true;
    }
  
    options.forEach(option => {
      if(!option.hasListener) {
        option.addEventListener("click", (e) => {
          const sortOption = e.target.textContent;
          selected.textContent = sortOption;
          optionContainer.style.display = "none";
          productFilter(tags, sortOption);
          removeBorder(columns);
        });
        option.hasListener = true;
      }
    });
  
    document.addEventListener("click", (e) => {
      if (!selectBox.contains(e.target)) {
        optionContainer.style.display = "none";
      }
    });
  }

  function itemDisplay() {
    const items = content.querySelectorAll(".productList li a");
  
    items.forEach(item => {
      if (!item.hasListener) {
        item.addEventListener("click", (e) => {
          e.preventDefault();
  
          const productId = item.parentElement.getAttribute("data-id");
  
          loadPage("item", () => {
            const product = products.find(p => p.id === productId);
            const itemInfo = content.querySelector(".itemInfo");
            const itemName = content.querySelector(".itemName");

            let category
            if (subCategory == "") {
              category = `<a href="#"><span>${mainCategory}</span></a>`
            } else {
              category = `<a href="#">${mainCategory}</a> | <a href="#"><span>${subCategory}</span></a>`
            }
                  
            if (deviceType === "Mobile" || deviceType === "Tablet") {
              itemName.innerHTML = "";
              itemInfo.innerHTML = `
                <div class="itemTop">
                  <div class="itemCategory">
                  ${category}
                  </div>
                  <div class="itemMainImg">
                    <img src="${product.mainImg}" alt="${product.name} 썸네일">
                  </div>
                  <div class="itemName">
                    ${product.name}
                  </div>
                  <div class="itemPrice">
                    ${product.price}원
                  </div>
                </div>
                <div class="itemInfoImg">
                  <img src="${product.infoImg}" alt="${product.name} 상세정보">
                </div>
              </div>`
              bottomSheetActive();
            } else {
              itemName.innerHTML = product.name;
              itemInfo.innerHTML = `
                <div class="itemTop">
                  <div class="itemCategory">
                  ${category}
                  </div>
                  <div class="itemMainImg">
                    <img src="${product.mainImg}" alt="${product.name} 썸네일">
                  </div>
                </div>
                <div class="itemInfoImg">
                  <img src="${product.infoImg}" alt="${product.name} 상세정보">
                </div>
              </div>`
              const itemOptionBox = content.querySelector(".itemOptionBox");
              const itemMainImg = content.querySelector(".itemMainImg");
              itemOptionBox.style.top = itemMainImg.offsetTop + 40 + "px";
            }
            
            const price = parseInt(product.price.replace(/,/g, ""));
            stepper(price);
            accordion();
          });
        });
        item.hasListener = true;
      }
    });
  }

  function bottomSheetActive() {
    const itemButtons = content.querySelector(".itemButtons");
    const bottomSheet = content.querySelector(".bottomSheet");
    const bottomSheetHeight = bottomSheet.offsetHeight;

    bottomSheet.style.bottom = `-${bottomSheetHeight}px`;
  
    itemButtons.addEventListener("click", () => {
      bottomSheet.classList.add("active");
      itemButtons.classList.add("active");
      bottomSheet.style.bottom = "";
      scrollLock();
    });
  
    document.addEventListener("click", (e) => {
      if (bottomSheet.classList.contains("active") && !bottomSheet.contains(e.target) && !itemButtons.contains(e.target)) {
        bottomSheet.classList.remove("active");
        itemButtons.classList.remove("active");
        bottomSheet.style.bottom = `-${bottomSheetHeight}px`;
        scrollUnlock();
      }
    });
  }

  function stepper(price) {
    const decreaseBtn = content.querySelector(".decrease");
    const increaseBtn = content.querySelector(".increase");
    const quantity = content.querySelector(".quantity");
    const totalPrice = content.querySelector(".totalPrice");

    quantity.value = 1;
  
    function updateTotalPrice() {
      totalPrice.innerHTML = (price * parseInt(quantity.value)).toLocaleString() + "원";
    }

    decreaseBtn.addEventListener("click", function () {
      let value = parseInt(quantity.value);
      if (value > 1) {
        quantity.value = value - 1;
        updateTotalPrice();
      }
    });
  
    increaseBtn.addEventListener("click", function () {
      let value = parseInt(quantity.value);
      quantity.value = value + 1;
      updateTotalPrice();
    });
  
    updateTotalPrice();
  }

  function accordion() {
    const itemSelectContainers = content.querySelectorAll(".itemSelectContainer");
  
    itemSelectContainers.forEach((container) => {
      container.addEventListener("click", (e) => {
        const optionContainer = container.querySelector(".optionContainer");
        const isOpen = optionContainer.classList.contains("active");
        const itemSelectBox = container.querySelector(".itemSelectBox");
        const selected = itemSelectBox.querySelector(".selected");
        const sortOption = e.target.textContent;
  
        selected.textContent = sortOption;
        selected.style.color = "#000";
  
        content.querySelectorAll(".optionContainer").forEach(con => {
          con.classList.remove("active");
        });
  
        if (!isOpen) {
          optionContainer.classList.add("active");
        }
      });
    });
  }
  
  function slideBanner() {
    const banner = content.querySelector(".banner")
    const slideContainer = banner.querySelector(".slideContainer");
    const prevBtn = banner.querySelector(".prev");
    const nextBtn = banner.querySelector(".next");

    let index = 1;
    let isAnimating = false;
    let autoSlideInterval;

    createSlides(3);

    const slides = banner.querySelectorAll(".slideItem");
    
    createIndicators();
    
    function createSlides(slideCount) {
      const slideContainer = banner.querySelector(".slideContainer");
      slideContainer.innerHTML = "";
    
      for (let i = 0; i < slideCount; i++) {
        const slideItem = document.createElement("div");
        slideItem.classList.add("slideItem");
    
        const img = document.createElement("img");
        img.src = deviceType === "PC"
          ? `00_source/02_layout/03_banner/banner_pc_${i + 1}.png`
          : `00_source/02_layout/03_banner/banner_mobile_${i + 1}.png`;
    
        img.alt = `배너 이미지 ${i + 1}`;
        slideItem.appendChild(img);
        slideContainer.appendChild(slideItem);
      }
    }

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    slideContainer.appendChild(firstClone);
    slideContainer.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll(".slideItem");
    slideContainer.style.transform = `translateX(-${index * 100}vw)`;

    function moveSlide(step) {
      if (isAnimating) return;
      isAnimating = true;

      index += step;
      slideContainer.style.transition = `transform 0.3s ease-in-out`;
      slideContainer.style.transform = `translateX(-${index * 100}vw)`;

      setTimeout(() => {
        if (index === allSlides.length - 1) {
          index = 1;
          slideContainer.style.transition = "none";
          slideContainer.style.transform = `translateX(-${index * 100}vw)`;
        } else if (index === 0) {
          index = allSlides.length - 2;
          slideContainer.style.transition = "none";
          slideContainer.style.transform = `translateX(-${index * 100}vw)`;
        }
        isAnimating = false;

        updateIndicator();
      }, 300);
    }

    function startAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => moveSlide(1), 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    function createIndicators() {
      const indicatorsContainer = banner.querySelector(".indicatorsContainer");
      indicatorsContainer.innerHTML = "";
    
      slides.forEach((_, i) => {
        const indicator = document.createElement("span");
        indicator.classList.add("indicator");
        indicator.dataset.index = i;
        if (i === 0) indicator.classList.add("active");
        indicatorsContainer.appendChild(indicator);
      });

      updateIndicator();
    }
    
    function updateIndicator() {
      const indicators = banner.querySelectorAll(".indicator");
      
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === index - 1);
      });

      indicators.forEach((indicator) => {
        indicator.addEventListener("click", () => {
          const indicatorIndex = parseInt(indicator.dataset.index) + 1;
          stopAutoSlide();
          moveSlide(indicatorIndex - index);
          startAutoSlide();
        });
      });
    }

    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      moveSlide(1);
      startAutoSlide();
    });
    
    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      moveSlide(-1);
      startAutoSlide();
    });

    banner.addEventListener("mouseenter", stopAutoSlide);
    banner.addEventListener("mouseleave", startAutoSlide);

    let startX
    let currentX
    let isSwiping

    banner.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
      currentX = NaN;
    });
  
    banner.addEventListener("touchmove", (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: false });
  
    banner.addEventListener("touchend", () => {
      if (!isSwiping) return;
  
      const deltaX = currentX - startX;
  
      if (deltaX < -50) {
        stopAutoSlide();
        moveSlide(1);
        startAutoSlide();
      } else if (deltaX > 50) {
        stopAutoSlide();
        moveSlide(-1);
        startAutoSlide();
      }

      isSwiping = false;
    }, { passive: false });

    startAutoSlide();
  }

  function manualSlide() {
    const productLists = content.querySelectorAll(".productList");
    const scrollLeftButtons = content.querySelectorAll(".scrollLeft");
    const scrollRightButtons = content.querySelectorAll(".scrollRight");
  
    productLists.forEach((productList, index) => {
      scrollLeftButtons[index].addEventListener("click", () => {
        productList.scrollTo({ left: 0, behavior: "smooth" });
      });
  
      scrollRightButtons[index].addEventListener("click", () => {
        productList.scrollTo({ left: productList.scrollWidth, behavior: "smooth" });
      });
    });
  }  
});