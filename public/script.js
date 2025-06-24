document.addEventListener('DOMContentLoaded', () => {
    const lockScreen = document.getElementById('lock-screen');
    const homeScreen = document.getElementById('home-screen');
    const twetaIcon = document.getElementById('tweta-icon');
    const clubchatIcon = document.getElementById('clubchat-icon');
    const twetaApp = document.getElementById('tweta-app');
    const clubchatApp = document.getElementById('clubchat-app');
    const backButtons = document.querySelectorAll('.back-to-home');

    // ÊŸÌ›… ·≈ŸÂ«— ‘«‘… „⁄Ì‰… Ê≈Œ›«¡ «·√Œ—Ï
    function showScreen(screenToShow) {
        const screens = [lockScreen, homeScreen, twetaApp, clubchatApp];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                // ≈÷«›… ›∆… active ·· √ÀÌ— «·«‰ ﬁ«·Ì ·· ÿ»Ìﬁ« 
                if (screen === twetaApp || screen === clubchatApp) {
                    screen.classList.add('active');
                }
            } else {
                screen.classList.add('hidden');
                if (screen === twetaApp || screen === clubchatApp) {
                    screen.classList.remove('active');
                }
            }
        });
    }

    // „Õ«ﬂ«… ”Õ» «·ﬁ›·
    lockScreen.addEventListener('click', () => { // Ì„ﬂ‰ «” »œ«·Â« »”Õ» ÕﬁÌﬁÌ
        showScreen(homeScreen);
    });

    // › Õ  ÿ»Ìﬁ Tweta
    twetaIcon.addEventListener('click', () => {
        showScreen(twetaApp);
    });

    // › Õ  ÿ»Ìﬁ ClubChat
    clubchatIcon.addEventListener('click', () => {
        showScreen(clubchatApp);
    });

    // «·⁄Êœ… ≈·Ï «·‘«‘… «·—∆Ì”Ì… „‰ √Ì  ÿ»Ìﬁ
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(homeScreen);
        });
    });

    // „‰ÿﬁ »”Ìÿ ·‰‘— «· €—Ìœ«  (·· Ê÷ÌÕ ›ﬁÿ° ·« ÌÊÃœ « ’«· »«·Œ·›Ì… Â‰« »⁄œ)
    const postTwetaBtn = document.getElementById('post-tweta-btn');
    const twetaPostInput = document.getElementById('tweta-post-input');
    const twetaFeed = document.getElementById('tweta-feed');

    if (postTwetaBtn) {
        postTwetaBtn.addEventListener('click', () => {
            const postText = twetaPostInput.value.trim();
            if (postText) {
                const newPost = document.createElement('div');
                newPost.classList.add('tweta-post');
                newPost.innerHTML = `<p><strong>√‰ :</strong> ${postText}</p><hr>`;
                twetaFeed.prepend(newPost); // ≈÷«›… «· €—Ìœ… ›Ì «·√⁄·Ï
                twetaPostInput.value = ''; // „”Õ Õﬁ· «·≈œŒ«·
            }
        });
    }

    //  ÕœÌÀ «·Êﬁ  Ê«· «—ÌŒ ⁄·Ï ‘«‘… «·ﬁ›·
    function updateLockScreenTime() {
        const timeElement = document.querySelector('.lock-screen .time');
        const dateElement = document.querySelector('.lock-screen .date');
        const now = new Date();

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions); //  ‰”Ìﬁ «·Êﬁ 

        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        // Â‰« Ì„ﬂ‰  Œ’Ì’ «· —Ã„… ··⁄—»Ì… »‘ﬂ· √›÷· ≈–« ﬂ«‰  «··€… «·«› —«÷Ì… ··„ ’›Õ ·Ì”  ⁄—»Ì…
        dateElement.textContent = now.toLocaleDateString('ar-DZ', dateOptions); // 'ar-DZ' ··Ã“«∆—
    }

    updateLockScreenTime();
    setInterval(updateLockScreenTime, 60000); //  ÕœÌÀ ﬂ· œﬁÌﬁ…

});