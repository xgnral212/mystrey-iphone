document.addEventListener('DOMContentLoaded', () => {
    const lockScreen = document.getElementById('lock-screen');
    const homeScreen = document.getElementById('home-screen');
    const twetaIcon = document.getElementById('tweta-icon');
    const clubchatIcon = document.getElementById('clubchat-icon');
    const twetaApp = document.getElementById('tweta-app');
    const clubchatApp = document.getElementById('clubchat-app');
    const backButtons = document.querySelectorAll('.back-to-home');

    // ����� ������ ���� ����� ������ ������
    function showScreen(screenToShow) {
        const screens = [lockScreen, homeScreen, twetaApp, clubchatApp];
        screens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                // ����� ��� active ������� ��������� ���������
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

    // ������ ��� �����
    lockScreen.addEventListener('click', () => { // ���� ��������� ���� �����
        showScreen(homeScreen);
    });

    // ��� ����� Tweta
    twetaIcon.addEventListener('click', () => {
        showScreen(twetaApp);
    });

    // ��� ����� ClubChat
    clubchatIcon.addEventListener('click', () => {
        showScreen(clubchatApp);
    });

    // ������ ��� ������ �������� �� �� �����
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(homeScreen);
        });
    });

    // ���� ���� ���� ��������� (������� ��ء �� ���� ����� �������� ��� ���)
    const postTwetaBtn = document.getElementById('post-tweta-btn');
    const twetaPostInput = document.getElementById('tweta-post-input');
    const twetaFeed = document.getElementById('tweta-feed');

    if (postTwetaBtn) {
        postTwetaBtn.addEventListener('click', () => {
            const postText = twetaPostInput.value.trim();
            if (postText) {
                const newPost = document.createElement('div');
                newPost.classList.add('tweta-post');
                newPost.innerHTML = `<p><strong>���:</strong> ${postText}</p><hr>`;
                twetaFeed.prepend(newPost); // ����� �������� �� ������
                twetaPostInput.value = ''; // ��� ��� �������
            }
        });
    }

    // ����� ����� �������� ��� ���� �����
    function updateLockScreenTime() {
        const timeElement = document.querySelector('.lock-screen .time');
        const dateElement = document.querySelector('.lock-screen .date');
        const now = new Date();

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions); // ����� �����

        const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
        // ��� ���� ����� ������� ������� ���� ���� ��� ���� ����� ���������� ������� ���� �����
        dateElement.textContent = now.toLocaleDateString('ar-DZ', dateOptions); // 'ar-DZ' �������
    }

    updateLockScreenTime();
    setInterval(updateLockScreenTime, 60000); // ����� �� �����

});