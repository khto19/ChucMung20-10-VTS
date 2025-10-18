document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const wishesScreen = document.getElementById('wishes-screen');
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const wishTextEl = document.getElementById('wish-text');
    const signatureLine = document.getElementById('signature-line');
    const newWishBtn = document.getElementById('new-wish-btn');
    const backBtn = document.getElementById('back-btn');
    const fireworksToggle = document.getElementById('fireworks-toggle');
    const canvas = document.getElementById('fireworks-canvas');
    
    // Music Player Elements
    const musicPlayer = document.getElementById('music-player');
    const musicToggle = document.getElementById('music-toggle');
    const musicDisc = document.getElementById('music-disc');
    const songItems = document.querySelectorAll('.song-item');
    const musicTooltip = document.getElementById('music-tooltip');

    // Image Slider Elements
    const slider = document.querySelector('.image-slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    // --- State ---
    let currentName = '';
    let fireworksEnabled = true;
    let animationFrameId;
    let musicPlaying = false;
    let typeIntervalId = null;
    let fireworkLaunchIntervalId = null;
    const particles = [];
    const flowers = [];
    let currentSlide = 0;
    
    // --- Music Setup ---
    let backgroundMusic = new Audio(); // Initialize empty audio object
    backgroundMusic.loop = true;

    const longWishes = [
       "Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn một ngày ngập tràn niềm vui và những bất ngờ ngọt ngào nhất. Mong bạn sẽ luôn xinh đẹp, rạng rỡ và giữ mãi nụ cười tỏa nắng trên môi. Hãy luôn tự tin và yêu thương bản thân mình thật nhiều, bạn nhé, vì bạn xứng đáng với mọi điều tốt đẹp.",
"Gửi đến bạn lời chúc 20/10 chân thành và ấm áp nhất. Chúc bạn luôn mạnh khỏe, bình an và hạnh phúc bên gia đình và những người thân yêu. Mong rằng mọi dự định trong tương lai của bạn đều sẽ thành công rực rỡ và cuộc sống luôn mỉm cười với bạn trên mọi chặng đường.",
"Chúc mừng ngày 20/10! Chúc cho người con gái tuyệt vời mà mình biết sẽ có một ngày thật ý nghĩa, nhận được nhiều hoa và những lời yêu thương. Hãy luôn là một cô gái kiên cường, bản lĩnh và không ngừng theo đuổi đam mê. Bạn chính là nguồn cảm hứng cho rất nhiều người đấy.",
"Nhân ngày đặc biệt này, mình muốn gửi đến bạn lời cảm ơn vì đã luôn là một người bạn tuyệt vời. Chúc bạn một ngày 20/10 thật nhiều tiếng cười, hạnh phúc và trọn vẹn. Mong rằng bạn sẽ luôn xinh đẹp, thông minh và gặt hái được nhiều thành công hơn nữa trong sự nghiệp.",
"Chúc bạn một ngày 20/10 thật đặc biệt, một ngày mà bạn được yêu thương và chiều chuộng hết mực. Hãy tạm gác lại mọi lo toan, bộn bề của cuộc sống để tận hưởng trọn vẹn ngày của riêng mình. Chúc bạn luôn trẻ trung, yêu đời và tràn đầy năng lượng tích cực mỗi ngày.",
"Gửi đến bạn ngàn đóa hoa hồng và những lời chúc tốt đẹp nhất nhân ngày 20/10. Mong bạn mãi giữ được nét duyên dáng, dịu dàng và một tâm hồn thật đẹp. Chúc cho con đường bạn đi sẽ luôn trải đầy hoa hồng và gặt hái được thật nhiều quả ngọt, xứng đáng với nỗ lực của bạn.",
"Chúc mừng ngày Phụ nữ Việt Nam! Chúc bạn không chỉ hôm nay mà 364 ngày còn lại trong năm đều luôn vui vẻ, hạnh phúc và được yêu thương. Hãy luôn là chính mình, tỏa sáng theo cách riêng và đừng quên rằng bạn luôn có một người bạn ở đây ủng hộ hết mình.",
"Nhân ngày 20/10, chúc bạn luôn có thật nhiều sức khỏe để thực hiện mọi ước mơ và hoài bão của mình. Mong bạn luôn tìm thấy niềm vui trong công việc, sự bình yên trong tâm hồn và sự ấm áp từ những người xung quanh. Hãy luôn là người phụ nữ hạnh phúc nhất nhé.",
"Hôm nay là ngày của bạn, hãy cho phép mình được nghỉ ngơi và tận hưởng những điều tuyệt vời nhất. Chúc bạn một ngày 20/10 thật vui, nhận được những món quà bất ngờ và những lời chúc ngọt ngào. Chúc bạn luôn xinh đẹp, may mắn và thành công trong mọi lĩnh vực cuộc sống.",
"Gửi đến cô gái hay cười của chúng ta, chúc bạn một ngày 20/10 thật nhiều niềm vui và hạnh phúc. Mong rằng nụ cười của bạn sẽ không bao giờ tắt và bạn sẽ luôn lan tỏa được nguồn năng lượng tích cực này đến với mọi người. Hãy luôn yêu đời và sống hết mình nhé!",
"Chúc bạn một ngày 20/10 thật lãng mạn và đáng nhớ. Mong rằng bạn sẽ có những khoảnh khắc tuyệt vời bên cạnh người mình yêu thương. Hãy luôn là người phụ nữ tự tin, độc lập và quyến rũ, khiến cho bất kỳ ai cũng phải ngưỡng mộ và trân trọng vẻ đẹp của bạn.",
"Nhân ngày tôn vinh phái đẹp, chúc bạn luôn giữ được tâm hồn trẻ trung, một trái tim nồng ấm và một tinh thần lạc quan. Cuộc sống có thể có nhiều thử thách, nhưng hãy luôn mạnh mẽ và vững bước tiến về phía trước. Bạn sẽ luôn tìm thấy thành công và hạnh phúc đang chờ đợi.",
"Chúc mừng 20/10! Chúc cho mọi gánh nặng trên vai bạn đều trở nên nhẹ nhàng hơn, mọi nỗi buồn đều tan biến và chỉ còn lại niềm vui, hạnh phúc. Bạn là một người phụ nữ tuyệt vời và xứng đáng có được một cuộc sống an yên, đủ đầy và trọn vẹn nhất.",
"Gửi bạn lời chúc 20/10 từ tận đáy lòng. Chúc bạn luôn xinh đẹp trong mắt mọi người, không chỉ bởi vẻ ngoài mà còn bởi trí tuệ và lòng nhân ái. Mong bạn sẽ luôn là phiên bản tốt nhất của chính mình và đạt được mọi mục tiêu mà bạn đã đề ra.",
"Hôm nay, hãy để thế giới chiều chuộng bạn. Chúc bạn một ngày 20/10 thật thư thái, được làm những điều mình thích và ở bên những người mình yêu. Chúc bạn luôn có một bờ vai vững chắc để tựa vào, một tâm hồn an nhiên và một cuộc sống viên mãn như ý.",
"Chúc mừng ngày Phụ nữ Việt Nam! Chúc bạn luôn có một sức khỏe dẻo dai, một tinh thần minh mẫn và một vẻ đẹp ngày càng mặn mà, đằm thắm theo thời gian. Hãy luôn tự hào vì bạn là một người phụ nữ tuyệt vời, một món quà quý giá của cuộc sống này.",
"Nhân ngày 20/10, mong rằng mọi điều may mắn và tốt đẹp nhất sẽ đến với bạn. Chúc bạn thành công trong sự nghiệp, hạnh phúc trong tình yêu và luôn giữ được ngọn lửa đam mê trong cuộc sống. Hãy luôn tỏa sáng và truyền cảm hứng cho những người xung quanh, bạn nhé.",
"Chúc bạn một ngày 20/10 không chỉ có hoa và quà, mà còn có thật nhiều sự quan tâm chân thành và những cái ôm ấm áp. Bạn xứng đáng được nhận tất cả những điều đó. Hãy luôn là cô gái hạnh phúc, tự do và làm chủ cuộc đời mình một cách trọn vẹn.",
"Gửi đến người con gái kiên cường mà tôi ngưỡng mộ, chúc bạn một ngày 20/10 thật ý nghĩa. Dù cuộc sống có thế nào, hãy luôn giữ vững niềm tin và bước tiếp. Phía trước luôn là bầu trời rực rỡ dành cho những người không bao giờ bỏ cuộc. Chúc bạn luôn thành công.",
"Chúc mừng 20/10! Chúc bạn có một ngày thật 'chill', không phải lo lắng về công việc hay bất cứ điều gì. Hãy dành thời gian chăm sóc bản thân, đọc một cuốn sách hay hoặc xem một bộ phim yêu thích. Bạn xứng đáng có những giây phút bình yên và thư giãn như vậy.",
"Nhân ngày của phái đẹp, chúc bạn luôn giữ được vẻ đẹp tự nhiên, sự thông minh sắc sảo và một trái tim giàu lòng trắc ẩn. Bạn là sự kết hợp hoàn hảo giữa vẻ đẹp và trí tuệ. Mong bạn sẽ luôn tự tin và khẳng định giá trị của mình trong mọi hoàn cảnh.",
"Chúc bạn một ngày 20/10 thật nhiều màu sắc và đầy ắp kỷ niệm đẹp. Hãy cùng bạn bè và người thân tạo nên những khoảnh khắc đáng nhớ. Mong rằng cuộc sống của bạn sẽ luôn là một bức tranh tươi sáng, rực rỡ và tràn ngập những điều thú vị đang chờ khám phá.",
"Gửi đến bạn lời chúc 20/10 dịu dàng như một bản nhạc du dương. Chúc bạn luôn tìm thấy sự bình yên trong tâm hồn, niềm vui trong những điều nhỏ bé và hạnh phúc trong từng khoảnh khắc. Hãy sống chậm lại một chút để cảm nhận trọn vẹn vẻ đẹp của cuộc sống này nhé.",
"Chúc mừng ngày Phụ nữ Việt Nam! Chúc bạn luôn là ngôi sao sáng nhất trong lĩnh vực của mình, luôn được đồng nghiệp tôn trọng và cấp trên tin tưởng. Sự nghiệp của bạn sẽ ngày càng thăng tiến và bạn sẽ đạt được những đỉnh cao mới, xứng đáng với tài năng và nỗ lực.",
"Nhân ngày 20/10, chúc cho mọi ước mơ của bạn sớm trở thành hiện thực. Đừng ngần ngại ước mơ và đừng bao giờ từ bỏ. Hãy luôn giữ vững niềm tin vào bản thân và khả năng của mình. Cả thế giới sẽ ủng hộ một cô gái dũng cảm và đầy hoài bão như bạn.",
"Chúc bạn một ngày 20/10 thật phong cách và sành điệu. Hãy khoác lên mình bộ trang phục đẹp nhất, trang điểm thật xinh và tự tin bước ra ngoài. Bạn là một biểu tượng của vẻ đẹp và sự tự tin. Hãy để cả thế giới thấy bạn rạng rỡ và tuyệt vời như thế nào.",
"Gửi đến bạn lời chúc sức khỏe và bình an trong ngày 20/10. Đây là tài sản quý giá nhất. Có sức khỏe, bạn sẽ có thể làm mọi điều mình muốn. Hãy luôn chăm sóc tốt cho bản thân cả về thể chất lẫn tinh thần, để mỗi ngày đều là một ngày tràn đầy năng lượng.",
"Chúc mừng 20/10! Mong rằng bạn sẽ luôn được bao bọc bởi tình yêu thương chân thành từ gia đình, bạn bè và 'người ấy'. Tình yêu sẽ là nguồn sức mạnh to lớn giúp bạn vượt qua mọi khó khăn và cảm thấy cuộc sống này thật ý nghĩa và ấm áp biết bao.",
"Nhân ngày đặc biệt này, chúc bạn có những chuyến đi thú vị, khám phá những vùng đất mới và gặp gỡ những con người mới. Hãy để tâm hồn mình được tự do phiêu lưu và làm giàu thêm vốn sống. Thế giới rộng lớn và có rất nhiều điều tuyệt vời đang chờ bạn phía trước.",
"Chúc bạn một ngày 20/10 thật ngọt ngào, như những viên kẹo socola và ấm áp như một tách trà nóng. Hãy tận hưởng những niềm vui giản dị và để cho tâm hồn mình được thư giãn hoàn toàn. Bạn xứng đáng có một ngày thật bình yên và hạnh phúc bên những điều thân thuộc.",
"Gửi đến người phụ nữ thông minh và sắc sảo, chúc bạn một ngày 20/10 thật ý nghĩa. Mong rằng trí tuệ của bạn sẽ luôn tỏa sáng, giúp bạn đưa ra những quyết định đúng đắn và đạt được thành công vang dội. Hãy tiếp tục học hỏi và phát triển bản thân không ngừng nhé.",
"Chúc mừng ngày 20/10! Chúc bạn luôn giữ được sự lạc quan và tinh thần 'thép'. Cuộc sống đôi khi không như ý, nhưng với nụ cười và sự mạnh mẽ của bạn, mọi khó khăn rồi cũng sẽ qua. Hãy tin rằng sau cơn mưa, cầu vồng sẽ lại xuất hiện rực rỡ.",
"Nhân ngày của bạn, chúc bạn luôn tìm thấy niềm đam mê và nhiệt huyết trong mọi việc mình làm. Khi làm việc bằng cả trái tim, bạn sẽ không chỉ tạo ra kết quả xuất sắc mà còn cảm thấy cuộc sống thật sự ý nghĩa. Hãy theo đuổi điều khiến trái tim bạn rung động.",
"Gửi bạn lời chúc 20/10 thật nhiều may mắn. Mong rằng Thần May Mắn sẽ luôn mỉm cười với bạn, giúp bạn thuận lợi trong công việc, suôn sẻ trong các mối quan hệ và luôn gặp được những người tốt. Mọi điều tốt đẹp nhất sẽ đến với một người xứng đáng như bạn.",
"Chúc bạn một ngày 20/10 thật trọn vẹn, một ngày để bạn nhìn lại và tự hào về những gì mình đã làm được. Bạn đã rất nỗ lực và mạnh mẽ. Hãy tiếp tục bước đi trên con đường của riêng mình, luôn xinh đẹp, tự chủ và hạnh phúc. Bạn là độc nhất và tuyệt vời nhất!"
    ];

    // --- Event Listeners ---
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (name) {
            currentName = name;
            showWishesScreen(name);
        } else {
            nameInput.classList.add('error');
            setTimeout(() => nameInput.classList.remove('error'), 500);
        }
    });

    newWishBtn.addEventListener('click', () => displayRandomWish(currentName));
    backBtn.addEventListener('click', showWelcomeScreen);

    fireworksToggle.addEventListener('click', () => {
        fireworksEnabled = !fireworksEnabled;
        fireworksToggle.textContent = fireworksEnabled ? 'Tắt pháo hoa' : 'Bật pháo hoa';
        fireworksToggle.classList.toggle('active', fireworksEnabled);
    });
    
    // --- Music Player Logic ---
    function handleFirstMusicInteraction() {
        if (!musicTooltip.classList.contains('hidden')) {
            musicTooltip.classList.add('hidden');
        }
    }

    function playMusic(songSrc) {
        backgroundMusic.src = songSrc;
        backgroundMusic.play().catch(e => console.log("User interaction needed to play audio."));
        musicPlaying = true;
        musicToggle.classList.add('active');
        musicDisc.classList.add('playing');
    }

    function pauseMusic() {
        backgroundMusic.pause();
        musicPlaying = false;
        musicToggle.classList.remove('active');
        musicDisc.classList.remove('playing');
    }

    musicToggle.addEventListener('click', () => {
        handleFirstMusicInteraction();
        if (musicPlaying) {
            pauseMusic();
        } else {
            const currentSong = document.querySelector('.song-item.active-song').dataset.song;
            playMusic(currentSong || 'nhacnen.mp3');
        }
    });

    songItems.forEach(item => {
        item.addEventListener('click', () => {
            handleFirstMusicInteraction();
            songItems.forEach(i => i.classList.remove('active-song'));
            item.classList.add('active-song');
            const songSrc = item.dataset.song;
            playMusic(songSrc);
        });
    });

    // --- Image Slider Logic ---
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    // --- Core Functions ---
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    function showWishesScreen(name) {
        signatureLine.textContent = 'From Khánh Toàn with love <3'; // Set signature text
        displayRandomWish(name);
        showScreen(wishesScreen);
        fireworksEnabled = true;
        fireworksToggle.textContent = 'Tắt pháo hoa';
        fireworksToggle.classList.add('active');
        launchFireworks();
        currentSlide = 0; // Reset slider
        updateSlider();
        musicTooltip.classList.remove('hidden'); // Show tooltip
    }

    function showWelcomeScreen() {
        showScreen(welcomeScreen);
        nameInput.value = '';
        stopFireworks();
        if (musicPlaying) pauseMusic();
    }

    function typeWish(greeting, wish) {
        if (typeIntervalId) clearInterval(typeIntervalId);
        wishTextEl.innerHTML = greeting;
        let charIndex = 0;
        typeIntervalId = setInterval(() => {
            if (charIndex < wish.length) {
                wishTextEl.innerHTML += wish.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeIntervalId);
                typeIntervalId = null;
            }
        }, 50); // Typing speed
    }

    function displayRandomWish(name) {
        const randomIndex = Math.floor(Math.random() * longWishes.length);
        const wishContent = longWishes[randomIndex];
        const greetingContent = `<strong>Gửi ${name},</strong><br><br>`;
        typeWish(greetingContent, wishContent);
    }

    // --- Canvas & Effects Setup ---
    function setupCanvas() {
        if (wishesScreen.clientWidth > 0) {
            canvas.width = wishesScreen.clientWidth;
            canvas.height = wishesScreen.clientHeight;
        }
    }

    class Flower {
        constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 5 + 8; this.speedY = Math.random() * 0.5 + 0.4; this.speedX = Math.random() * 0.4 - 0.2; this.rotationSpeed = Math.random() * 0.02 - 0.01; this.angle = 0; this.opacity = Math.random() * 0.7 + 0.3; this.color = Math.random() > 0.4 ? '#ffb6c1' : '#ffc0cb'; }
        update() { this.y += this.speedY; this.x += this.speedX; this.angle += this.rotationSpeed; if (this.y > canvas.height + this.size) { this.y = -this.size; this.x = Math.random() * canvas.width; } }
        draw(ctx) { ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.fillStyle = this.color; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(this.size / 2, -this.size, 0, -this.size * 1.5); ctx.quadraticCurveTo(-this.size / 2, -this.size, 0, 0); ctx.fill(); ctx.rotate((Math.PI * 2) / 5); } ctx.fillStyle = '#ffeea0'; ctx.beginPath(); ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }

    function initFlowers() { if (canvas.width === 0) setupCanvas(); flowers.length = 0; const flowerCount = 20; for (let i = 0; i < flowerCount; i++) { flowers.push(new Flower()); } }

    class Particle {
        constructor(x, y, color, type) { this.x = x; this.y = y; this.color = color; this.type = type; this.alpha = 1; if (type === 'firework') { this.sx = Math.random() * 4 - 2; this.sy = Math.random() * -3 - (canvas.height / 70); this.size = 2; this.targetY = Math.random() * (canvas.height / 2) + (canvas.height / 4); } else if (type === 'explosion') { const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 8 + 2; this.sx = Math.cos(angle) * speed; this.sy = Math.sin(angle) * speed; this.friction = 0.96; this.gravity = 0.1; this.decay = Math.random() * 0.02 + 0.015; this.size = 2; } else if (type === 'trail') { this.sx = Math.random() * 2 - 1; this.sy = Math.random() * 2 - 1; this.gravity = 0.05; this.decay = Math.random() * 0.05 + 0.05; this.size = 1; } }
        update() { if (this.type === 'firework') { this.x += this.sx; this.y += this.sy; this.sy += 0.04; if (Math.random() > 0.4) particles.push(new Particle(this.x, this.y, this.color, 'trail')); if (this.y <= this.targetY || this.sy >= 0) { this.alpha = 0; for (let i = 0; i < 150; i++) particles.push(new Particle(this.x, this.y, this.color, 'explosion')); } } else { this.x += this.sx; this.y += this.sy; if (this.type === 'explosion') { this.sx *= this.friction; this.sy *= this.friction; this.sy += this.gravity; } else { this.sy += this.gravity; } this.alpha -= this.decay; } }
        draw(ctx) { ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }

    function launchFireworks() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        setupCanvas();
        if (fireworksEnabled) { for (let i = 0; i < 5; i++) { setTimeout(() => { if (!fireworksEnabled) return; const color = `hsl(${Math.random() * 360}, 100%, 60%)`; particles.push(new Particle(Math.random() * canvas.width, canvas.height, color, 'firework')); }, i * 200 + 200); } }
        fireworkLaunchIntervalId = setInterval(() => { if (fireworksEnabled) { const color = `hsl(${Math.random() * 360}, 100%, 60%)`; particles.push(new Particle(Math.random() * canvas.width, canvas.height, color, 'firework')); } }, 1200);
        loop();
    }
    
    function stopFireworks() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (fireworkLaunchIntervalId) clearInterval(fireworkLaunchIntervalId);
        animationFrameId = null; fireworkLaunchIntervalId = null; particles.length = 0; const ctx = canvas.getContext('2d'); if (canvas.width > 0) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function loop() {
        const ctx = canvas.getContext('2d');
        if (canvas.width > 0) {
            ctx.fillStyle = 'rgba(255, 253, 247, 0.1)'; // Đã đổi lại màu nền
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        flowers.forEach(f => { f.update(); f.draw(ctx); });
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        animationFrameId = requestAnimationFrame(loop);
    }
    
    // --- Initial Setup ---
    initFlowers();
    window.addEventListener('resize', () => { setupCanvas(); initFlowers(); });
});


