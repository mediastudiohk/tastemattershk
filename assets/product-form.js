if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.cart =
          document.querySelector("cart-notification") ||
          document.querySelector("cart-drawer");
        this.submitButton = this.querySelector('[type="submit"]');

        if (document.querySelector("cart-drawer") && this.submitButton) {
          this.submitButton.setAttribute("aria-haspopup", "dialog");
        }
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton && this.submitButton.getAttribute("aria-disabled") === "true") return;

        this.handleErrorMessage();

        this.submitButton.setAttribute("aria-disabled", true);
        this.submitButton.classList.add("loading");
        // this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

        const config = fetchConfig("javascript");
        config.headers["X-Requested-With"] = "XMLHttpRequest";
        delete config.headers["Content-Type"];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            "sections",
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append("sections_url", window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            fetch(`${routes.cart_url}`, config)
              .then((res) => res.json())
              .then((data) => {
                const checkoutNav = document.querySelectorAll("#checkout-nav");
                if (checkoutNav && data.total_price >= 50000) {
                  for (let el of checkoutNav) {
                    el.classList.remove("disable-button");
                  }
                }
                const elementToReplace =
                  document.querySelectorAll("#cart-icon-bubble");
                for (let elBasket of elementToReplace) {
                  elBasket.innerHTML = data.item_count;
                }

                if (response.status === 422) {
                  this.handleUpdateCart(data.items);
                }
              })
              .catch((e) => {
                console.error(e);
              });

            if (response.status) {
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.querySelector(".sold-out-wrapper");
              if (!soldOutMessage) return;
              this.submitButton.setAttribute("aria-disabled", true);
              // this.submitButton.querySelector("span").classList.add("hidden");
              soldOutMessage.classList.remove("hidden");
              soldOutMessage.querySelector(".sold-out-message").innerText =
                response.description;
              this.error = true;
              return;
            } else if (window.routes.cart_url === window.location.pathname) {
              window.location = window.routes.cart_url;

              return;
            }
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, { source: "product-form" });
            this.error = false;

            const popoverAddToBasket = this.submitButton.querySelector(
              ".popover-add-to-basket"
            );
            if (popoverAddToBasket) {
              popoverAddToBasket.classList.add("show");
              setTimeout(() => {
                popoverAddToBasket.classList.remove("show");
              }, 3000);
            }

            const quickAddModal = this.closest("quick-add-modal");
            if (quickAddModal) {
              document.body.addEventListener(
                "modalClosed",
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              setTimeout(() => {
                quickAddModal.hide(true);
              }, 1000);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove("loading");
            if (this.cart && this.cart.classList.contains("is-empty"))
              this.cart.classList.remove("is-empty");
            if (!this.error) this.submitButton.removeAttribute("aria-disabled");
            // this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        if (!this.errorMessageWrapper) return;
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          const productName =
            document.querySelector(".product-page-name").innerText;
          const inputQuantity = document.querySelector(
            ".quantity__input.quantity_form_input"
          );
          const maximumQuantity = inputQuantity.getAttribute("max");
          const errorMsg = `All ${maximumQuantity} ${productName} are in your cart.`;
          this.errorMessage.textContent = errorMsg;
        }
      }

      handleUpdateCart(items = []) {
        const productName =
          document.querySelector(".product-page-name").innerText;
        const inputQuantity = document.querySelector(
          ".quantity__input.quantity_form_input"
        );
        const maximumQuantity = inputQuantity.getAttribute("max");

        const quantityItems = items.map((item) => {
          if (item.title.trim() === productName.trim()) {
            item.quantity = Number(maximumQuantity);
          }
          return item;
        });
        const arrUpdateItems = quantityItems.map((item) =>
          item.title.trim() === productName.trim() ? String(item.quantity) : ""
        );

        const loading_overlay = document.getElementById("loading_overlay");
        loading_overlay.classList.add("show");
        fetch(`${routes.cart_update_url}`, {
          ...fetchConfig(),
          body: JSON.stringify({
            ...{ updates: arrUpdateItems },
            sections: this.cart
              .getSectionsToRender()
              .map((section) => section.id),
            sections_url: window.location.pathname,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            this.cart.getSectionsToRender().forEach((section) => {
              const elementToReplace = document.querySelector(section.selector);
              if (elementToReplace) {
                elementToReplace.innerHTML = this.cart.getSectionInnerHTML(
                  response.sections[section.id],
                  section.selector
                );
              }
            });
            this.cart
              .querySelector("#CartDrawer-Overlay")
              .addEventListener("click", () => this.cart.close());
          })
          .catch(function (error) {
            console.error("Error updating cart", error);
          })
          .finally(() => {
            loading_overlay.classList.remove("show");
          });
      }
    }
  );
}
