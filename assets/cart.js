class CartItems extends HTMLElement {
  constructor() {
    super();
    this.state = {
      removeCartItem: [],
    };
    this.lineItemStatusElement =
      document.getElementById("shopping-cart-line-item-status") ||
      document.getElementById("CartDrawer-LineItemStatus");
    this.querySelector(".my-basket_link_update").addEventListener(
      "click",
      this.updateCart.bind(this)
    );
    this.quantityInput = this.querySelectorAll(".quantity__input");
    for (let i of this.quantityInput) {
      i.addEventListener("change", this.changeQuantity.bind(this));
    }
    this.removeItem = this.querySelectorAll(".check-box-remove");
    for (let j of this.removeItem) {
      j.addEventListener("change", this.checkRemove.bind(this));
    }
  }
  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => {
        if (event.source === "cart-items") {
          return;
        }
        this.onCartUpdate();
      }
    );
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  onClick() {
    const items = document.getElementsByClassName("items-list");
    if (
      !this.state.removeCartItem.length &&
      this.state.removeCartItem.length != items.length
    ) {
      for (let index = 0; index < items.length; index++) {
        this.state.removeCartItem[index] = "";
      }
    }
  }

  changeQuantity(event) {
    const value = event.target.value;
    const items = document.getElementsByClassName("items-list");
    if (
      !this.state.removeCartItem.length &&
      this.state.removeCartItem.length != items.length
    ) {
      for (let index = 0; index < items.length; index++) {
        this.state.removeCartItem[index] = "";
      }
    }

    if (value < 1 || value % 1 !== 0) {
      this.state.removeCartItem[event.target.dataset.index - 1] = 1;
    } else {
      this.state.removeCartItem[event.target.dataset.index - 1] = value;
    }
  }

  checkRemove(event) {
    const items = document.getElementsByClassName("items-list");
    if (
      !this.state.removeCartItem.length &&
      this.state.removeCartItem.length != items.length
    ) {
      for (let index = 0; index < items.length; index++) {
        this.state.removeCartItem[index] = "";
      }
    }
    if (this.state.removeCartItem[event.target.dataset.index - 1] === "0") {
      this.state.removeCartItem[event.target.dataset.index - 1] = "";
      document
        .getElementById(`Quantity-${event.target.dataset.index}`)
        .classList.remove("input-disable");
    } else {
      document
        .getElementById(`Quantity-${event.target.dataset.index}`)
        .classList.add("input-disable");
      this.state.removeCartItem[event.target.dataset.index - 1] = "0";
    }
  }

  updateCart() {
    if (this.state.removeCartItem.length) {
      const loading_overlay = document.getElementById("loading_overlay");
      loading_overlay.classList.add("show");
      fetch("/cart/update", {
        ...fetchConfig(),
        body: JSON.stringify({
          ...{ updates: this.state.removeCartItem },
          sections: this.getSectionsToRender().map(
            (section) => section.section
          ),
          sections_url: window.location.pathname,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          this.state.removeCartItem = [];
          this.getSectionsToRender().forEach((section) => {
            const elementToReplace =
              document
                .getElementById(section.id)
                .querySelector(section.selector) ||
              document.getElementById(section.id);
            elementToReplace.innerHTML = this.getSectionInnerHTML(
              response.sections[section.section],
              section.selector
            );
          });
          location.reload();
        })
        .catch(function (error) {
          console.error("Error updating cart", error);
          this.state.removeCartItem = [];
          location.reload();
        })
        .finally(() => {
          loading_overlay.classList.remove("show");
        });
    }
  }

  onCartUpdate() {
    fetch("/cart?section_id=main-cart-items")
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const sourceQty = html.querySelector("cart-items");
        this.innerHTML = sourceQty.innerHTML;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: "#CartDrawer",
      },
    ];
  }

  async updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    const loading_overlay = document.getElementById("loading_overlay");
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });
    loading_overlay.classList.add("show");
    await fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        // debugger
        // window.location = window.routes.cart_url;
        const parsedState = JSON.parse(state);
        const quantityElement =
          document.getElementById(`Quantity-${line}`) ||
          document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll(".cart-item");

        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute("value");
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle("is-empty", parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector("cart-drawer");
        const cartFooter = document.getElementById("main-cart-footer");

        if (cartFooter)
          cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
        if (cartDrawerWrapper)
          cartDrawerWrapper.classList.toggle(
            "is-empty",
            parsedState.item_count === 0
          );

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
        const updatedValue = parsedState.items[line - 1]
          ? parsedState.items[line - 1].quantity
          : undefined;
        let message = "";
        if (
          items.length === parsedState.items.length &&
          updatedValue !== parseInt(quantityElement.value)
        ) {
          if (typeof updatedValue === "undefined") {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace(
              "[quantity]",
              updatedValue
            );
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) ||
          document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(
                cartDrawerWrapper,
                lineItem.querySelector(`[name="${name}"]`)
              )
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper.querySelector(".drawer__inner-empty"),
            cartDrawerWrapper.querySelector("a")
          );
        } else if (document.querySelector(".cart-item") && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper,
            document.querySelector(".cart-item__name")
          );
        }
        publish(PUB_SUB_EVENTS.cartUpdate, { source: "cart-items" });
      })
      .catch(() => {
        this.querySelectorAll(".loading-overlay").forEach((overlay) =>
          overlay.classList.add("hidden")
        );
        const errors =
          document.getElementById("cart-errors") ||
          document.getElementById("CartDrawer-CartErrors");
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        this.disableLoading(line);
        loading_overlay.classList.remove("show");
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) ||
      document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError)
      lineItemError.querySelector(".cart-item__error-text").innerHTML = message;

    this.lineItemStatusElement.setAttribute("aria-hidden", true);

    const cartStatus =
      document.getElementById("cart-live-region-text") ||
      document.getElementById("CartDrawer-LiveRegionText");
    cartStatus.setAttribute("aria-hidden", false);

    setTimeout(() => {
      cartStatus.setAttribute("aria-hidden", true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.add("cart__items--disabled");

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading-overlay`
    );
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading-overlay`
    );

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) =>
      overlay.classList.remove("hidden")
    );

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }

  disableLoading(line) {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.remove("cart__items--disabled");

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading-overlay`
    );
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading-overlay`
    );

    cartItemElements.forEach((overlay) => overlay.classList.add("hidden"));
    cartDrawerItemElements.forEach((overlay) =>
      overlay.classList.add("hidden")
    );
  }
}

customElements.define("cart-items", CartItems);

if (!customElements.get("cart-note")) {
  customElements.define(
    "cart-note",
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          "change",
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, {
              ...fetchConfig(),
              ...{ body },
            });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}
