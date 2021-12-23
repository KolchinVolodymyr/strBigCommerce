import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import swal from "./sweet-alert";

export const CartPreviewEvents = {
    close: 'closed.fndtn.dropdown',
    open: 'opened.fndtn.dropdown',
};

export default function (secureBaseUrl, cartId) {
    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdown');
    const $cartLoading = $('<div class="loadingOverlay"></div>');

    const $body = $('body');

    if (window.ApplePaySession) {
        $cartDropdown.addClass('apple-pay-supported');
    }

    $body.on('cart-quantity-update', (event, quantity) => {
        $cart.attr('aria-label', (_, prevValue) => prevValue.replace(/\d+/, quantity));

        if (!quantity) {
            $cart.addClass('navUser-item--cart__hidden-s');
        } else {
            $cart.removeClass('navUser-item--cart__hidden-s');
        }

        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
        if (utils.tools.storage.localStorageAvailable()) {
            localStorage.setItem('cart-quantity', quantity);
        }
    });

    $cart.on('click', event => {
        const options = {
            template: 'common/cart-preview',
        };

        // Redirect to full cart page
        //
        // https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
        // In summary, we recommend looking for the string 'Mobi' anywhere in the User Agent to detect a mobile device.
        if (/Mobi/i.test(navigator.userAgent)) {
            return event.stopPropagation();
        }

        event.preventDefault();

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
        });
    });

    let quantity = 0;

    if (cartId) {
        // Get existing quantity from localStorage if found
        if (utils.tools.storage.localStorageAvailable()) {
            if (localStorage.getItem('cart-quantity')) {
                quantity = Number(localStorage.getItem('cart-quantity'));
                $body.trigger('cart-quantity-update', quantity);
            }
        }

        // Get updated cart quantity from the Cart API
        const cartQtyPromise = new Promise((resolve, reject) => {
            utils.api.cart.getCartQuantity({ baseUrl: secureBaseUrl, cartId }, (err, qty) => {
                if (err) {
                    // If this appears to be a 404 for the cart ID, set cart quantity to 0
                    if (err === 'Not Found') {
                        resolve(0);
                    } else {
                        reject(err);
                    }
                }
                resolve(qty);
            });
        });

        // If the Cart API gives us a different quantity number, update it
        cartQtyPromise.then(qty => {
            quantity = qty;
            $body.trigger('cart-quantity-update', quantity);
        });
    } else {
        $body.trigger('cart-quantity-update', quantity);
    }

    $cartDropdown.on('click', event => {

        setTimeout(() => {
            $cartDropdown.addClass("is-open")
        }, 0);

        document.querySelectorAll('.previewCartList .button').forEach((element) => {
            if (element == event.target.parentElement.parentElement) {
                const itemId = element.getAttribute('data-cart-itemid');
                const $el = $(`#qty-${itemId}`);
                const oldQty = parseInt($el.val(), 10);
                $el.val(element.dataset.action === 'inc' ? oldQty + 1 : oldQty - 1);

            };
        })

        /**/
        document.querySelectorAll('.previewCartList .cart-item-qty-input').forEach((element) => {
            element.addEventListener('input', function(e){
                const $elementInput = e.target;
                const newQty = parseInt(Number(e.target.value), 10);
                const itemId = $elementInput.getAttribute('data-cart-itemid');

                // Does not quality for min/max quantity
                if (!newQty) {
                    return swal.fire({
                        text: `${e.target.value} is not a valid entry`,
                        icon: 'error',
                    });
                }

                utils.api.cart.itemUpdate(itemId, newQty,(err, response) => {
                    if (response.data.status !== 'succeed') {
                        swal.fire({
                            text: response.data.errors.join('\n'),
                            icon: 'error',
                        });
                    }
                });
                const options = {
                    template: 'common/cart-preview',
                };
                $cartDropdown
                    .addClass(loadingClass)
                    .html($cartLoading);
                $cartLoading
                    .show();
                utils.api.cart.getContent(options, (err, response) => {
                    $cartDropdown
                        .removeClass(loadingClass)
                        .html(response);
                    $cartLoading
                        .hide();
                });
            })
        })
        if(event.target === $('#update-cart')[0]) {
            const cartQtyInput = document.querySelectorAll('.previewCartList .cart-item-qty-input');
            let items = [];
            for (const i of cartQtyInput) {
                let line = {
                        id: i.dataset.cartItemid,
                        quantity: i.value,
                    }
                items.push(line);
            }
            utils.api.cart.itemUpdate(items, (err, response) => {
                if (response.data.status !== 'succeed') {
                    swal.fire({
                        text: response.data.errors.join('\n'),
                        icon: 'error',
                    });
                }
            })
             const options = {
                 template: 'common/cart-preview',
             };
             $cartDropdown
                 .addClass(loadingClass)
                 .html($cartLoading);
             $cartLoading
                 .show();
             utils.api.cart.getContent(options, (err, response) => {
                 $cartDropdown
                     .removeClass(loadingClass)
                     .html(response);
                 $cartLoading
                     .hide();
             });
            cartPromise.then(()=>{
                const options = {
                    template: 'common/cart-preview',
                };
                $cartDropdown
                    .addClass(loadingClass)
                    .html($cartLoading);
                $cartLoading
                    .show();
                utils.api.cart.getContent(options, (err, response) => {
                    $cartDropdown
                        .removeClass(loadingClass)
                        .html(response);
                    $cartLoading
                        .hide();
                });
            });
        }

    })
}
