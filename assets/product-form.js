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

        if (document.querySelector("cart-drawer")) {
          this.submitButton.setAttribute("aria-haspopup", "dialog");
        }

        // // scale product image
        // this.productImage = document.querySelector('.product-image_wrapper');
        // if(this.productImage){
        //   const image = this.productImage.querySelector('img');
        //   const scale = 1.6; // set the scale factor to zoom in the image
        //   let mouseX, mouseY, startX, startY;

        //   this.productImage.addEventListener('mousemove', e => {
        //     mouseX = e.clientX;
        //     mouseY = e.clientY;
        //     if (startX === undefined || startY === undefined) {
        //       startX = e.clientX - image.offsetLeft;
        //       startY = e.clientY - image.offsetTop;
        //     }
        //     const x = startX - mouseX;
        //     const y = startY - mouseY;
        //     const translateX = (x / this.productImage.offsetWidth) * 100;
        //     const translateY = (y / this.productImage.offsetHeight) * 100;
        //     const zoomX = (mouseX / this.productImage.offsetWidth) * (scale - 1);
        //     const zoomY = (mouseY / this.productImage.offsetHeight) * (scale - 1);
        //     image.style.transform = `translate(${translateX}%, ${translateY}%) scale(${scale})`;
        //     image.style.transformOrigin = `${zoomX * 100}% ${zoomY * 100}%`;
        //   });

        //   this.productImage.addEventListener('mouseleave', e => {
        //     image.style.transform = 'translate(0, 0) scale(1)';
        //     startX = undefined;
        //     startY = undefined;
        //   });
        // }
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute("aria-disabled") === "true") return;

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
            if (response.status) {
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.querySelector(".sold-out-wrapper");
              if (!soldOutMessage) return;
              this.submitButton.setAttribute("aria-disabled", true);
              // this.submitButton.querySelector("span").classList.add("hidden");
              soldOutMessage.classList.remove("hidden");
              soldOutMessage.querySelector('.sold-out-message').innerText = response.description;
              this.error = true;
              return;
            } else if (window.routes.cart_url === window.location.pathname) {
              window.location = window.routes.cart_url;
              return;
            }
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, { source: "product-form" });
            this.error = false;
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
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
            const popoverAddToBasket = this.submitButton.querySelector(".popover-add-to-basket");
            if(popoverAddToBasket){
              popoverAddToBasket.classList.add('show')
              setTimeout(() => {
                popoverAddToBasket.classList.remove('show')
              }, 3000)
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
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}
