/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
$(function(){
    const referBannerId = 'referBanner';
    const defaultTextId = 'default-text';
    const thanksTextId = 'thanks-text';
    const referBanner = document.getElementById(referBannerId);
    const defaultText = document.getElementById(defaultTextId);
    const thanksText = document.getElementById(thanksTextId);
    const referBannerHideExpiresInMonths = 6;
    const storageKeyClosed = 'refer-banner-closed';
    const storageKeyShared = 'refer-banner-shared';

    function storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    function showReferBanner() {
        if (localStorage.getItem(storageKeyShared)) {
            return;
        }

        if (!!window.piwik.hasSuperUserAccess === false) {
            return;
        }

        if (localStorage.getItem(storageKeyClosed)) {
            let date = new Date();

            date.setMonth(date.getMonth() - referBannerHideExpiresInMonths);

            if (date.valueOf() < localStorage.getItem(storageKeyClosed)) {
                return;
            }
        }

        referBanner.classList.remove("hide");
    }

    function closeReferBanner() {
        let date = new Date();

        localStorage.setItem(storageKeyClosed, date.valueOf());

        referBanner.classList.add("hide");
    }

    function sharedReferBanner() {
        let date = new Date();

        localStorage.setItem(storageKeyShared, date.valueOf());

        defaultText.classList.add("hide");
        thanksText.classList.remove("hide");
    }

    if (storageAvailable('localStorage') && referBanner) {
        showReferBanner();

        $(referBanner)
            .find(".icon-close")
            .click(closeReferBanner);

        $(referBanner).on("click", ".share-button", sharedReferBanner);

        $(referBanner).on("click", "#send-email", sharedReferBanner);
    }
})
