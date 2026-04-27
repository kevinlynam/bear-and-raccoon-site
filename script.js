document.addEventListener('DOMContentLoaded', () => {
            
            // ==========================================
            // 1. API FETCH & DOWNLOAD LOGIC
            // ==========================================
            const workerUrl = '/api/adventure'; 
            
            fetch(workerUrl)
                .then(response => response.json())
                .then(data => {
                    const imgEl = document.getElementById('daily-image');
                    const msgEl = document.getElementById('daily-message');
                    imgEl.src = data.imageUrl;
                    msgEl.innerText = data.message;
                    msgEl.classList.remove('loading-text');
                })
                .catch(() => {
                    document.getElementById('daily-message').innerText = "The Bear and Raccoon are sleeping today.";
                });

            document.getElementById('btn-download').addEventListener('click', () => {
                const imgSrc = document.getElementById('daily-image').src;
                if (!imgSrc || imgSrc === "") return;
                
                const a = document.createElement('a');
                a.href = imgSrc;
                a.download = `Bear_and_Raccoon_${new Date().toISOString().split('T')[0]}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });

            // ==========================================
            // 2. DAILY LOVE NOTE
            // ==========================================
            const loveNotes = [
                "I love you more everyday",
                "You make me feel valued and loved",
                "Every day with you is a new adventure",
                "I can't wait to spend the rest of our lives together", 
                "You make a me a complete person",
                "I love you more than all the stars in the sky",
                "I will always protect and care for you",
                "You are my everything",
                "Nothing will stop my love for you baby",
                "You make each day brighter",
                "You are my favorite person",
                "I am a peace when I'm with you",
                "I will always do my best to support you",
                "You are my favorite",
                "I love my life with you"
            ];
            
            const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            document.getElementById('daily-love-note').innerText = `"${loveNotes[dayOfYear % loveNotes.length]}"`;

            // ==========================================
            // 3. COUNTDOWN TIMER
            // ==========================================
            const targetDate = new Date('2026-05-05').getTime(); 

            function updateCountdown() {
                const now = new Date().getTime();
                const distance = targetDate - now;

                if (distance < 0) {
                    document.getElementById('countdown').innerText = "It's here!";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                document.getElementById('countdown').innerText = `${days} days to go!`;
            }
            
            updateCountdown(); 
            setInterval(updateCountdown, 86400000);

            // ==========================================
            // 4. EMERGENCY HUGS
            // ==========================================
            const hugMessages = [
                "Take a deep breath. I am so proud of you.",
                "You are safe right now. This feeling is temporary and it will pass.",
                "I love you so much. Close your eyes and imagine me holding your hand.",
                "You don't have to figure everything out right now. Just rest.",
                "You are the strongest person I know. Take all the time you need.",
                "Things are gonna be okay. I believe in you.",
                "It may feel insurmountable now, but you're gonna make it through.",
                "Imagine you are safely curled up in my bear pouch.",
                "Think about curling up with a group of snuggly purring kitties.",
                "It's gonna be okay. I promise you.",
                "What is now is not always. Soon this will be a memory and nothing more."
            ];

            document.getElementById('btn-hug').addEventListener('click', () => {
                const randomHug = hugMessages[Math.floor(Math.random() * hugMessages.length)];
                document.getElementById('hug-message').innerText = `"${randomHug}"`;
            });

            // ==========================================
            // 5. BEAN JUMP GAME LOGIC
            // ==========================================
            const canvas = document.getElementById('kittyGame');
            const ctx = canvas.getContext('2d');
            const startScreen = document.getElementById('start-screen');
            const gameOverScreen = document.getElementById('game-over-screen');
            const finalScoreEl = document.getElementById('final-score');

            let kitty, obstacles, score, gameLoopId, isGameOver, isGameStarted, framesUntilNextSpawn;
            let highScores = JSON.parse(localStorage.getItem('beanJumpScores')) || [];

            function updateLeaderboard(newScore) {
                if (newScore > 0) {
                    highScores.push(newScore);
                    highScores.sort((a, b) => b - a);
                    highScores = highScores.slice(0, 3);
                    localStorage.setItem('beanJumpScores', JSON.stringify(highScores));
                }
                renderLeaderboard();
            }

            function renderLeaderboard() {
                const listEl = document.getElementById('high-score-list');
                listEl.innerHTML = '';
                if (highScores.length === 0) {
                    listEl.innerHTML = '<li style="color: #888; font-weight: normal;">No high scores yet!</li>';
                } else {
                    highScores.forEach((score, index) => {
                        let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                        listEl.innerHTML += `<li style="padding: 4px 0;">${medal} ${score} pts</li>`;
                    });
                }
            }

            function initGame() {
                kitty = { x: 50, y: 110, width: 30, height: 30, dy: 0, gravity: 0.5, jumpPower: -9, isJumping: false };
                isGameStarted = false;
                isGameOver = false;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.save(); 
                ctx.translate(kitty.x + 15, kitty.y + 25); 
                ctx.scale(-1, 1); 
                ctx.font = "30px Arial";
                ctx.fillText("🐈", -15, 0); 
                ctx.restore(); 

                ctx.beginPath();
                ctx.moveTo(0, 140);
                ctx.lineTo(canvas.width, 140);
                ctx.strokeStyle = "#80287a";
                ctx.lineWidth = 2;
                ctx.stroke();

                startScreen.classList.remove('hidden');
                gameOverScreen.classList.add('hidden');
            }

            function resetGame() {
                kitty = { x: 50, y: 110, width: 30, height: 30, dy: 0, gravity: 0.5, jumpPower: -9, isJumping: false };
                obstacles = [];
                score = 0;
                framesUntilNextSpawn = 0; 
                isGameOver = false;
                isGameStarted = true;
                
                startScreen.classList.add('hidden');
                gameOverScreen.classList.add('hidden');
                
                cancelAnimationFrame(gameLoopId);
                gameLoop();
            }

            function handleInput() {
                if (!isGameStarted) {
                    resetGame(); 
                } else if (isGameOver) {
                    resetGame(); 
                } else if (!kitty.isJumping) {
                    kitty.dy = kitty.jumpPower;
                    kitty.isJumping = true;
                }
            }

            // Game Event Listeners
            canvas.addEventListener('mousedown', handleInput);
            canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(); }, {passive: false});
            startScreen.addEventListener('mousedown', handleInput);
            startScreen.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(); }, {passive: false});
            document.getElementById('btn-reset-game').addEventListener('click', resetGame);
            document.addEventListener('keydown', (e) => { if (e.code === 'Space') handleInput(); });
            // Add jump controls to the leaderboard area
            const leaderboardArea = document.getElementById('leaderboard-area');
            leaderboardArea.addEventListener('mousedown', handleInput);
            leaderboardArea.addEventListener('touchstart', (e) => { 
                if (isGameStarted && !isGameOver) e.preventDefault(); // Prevents screen scrolling while actively playing
                handleInput(); 
            }, {passive: false});

            function gameLoop() {
                if (isGameOver || !isGameStarted) return;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                kitty.dy += kitty.gravity;
                kitty.y += kitty.dy;

                if (kitty.y > 110) {
                    kitty.y = 110;
                    kitty.dy = 0;
                    kitty.isJumping = false;
                }

                ctx.save(); 
                ctx.translate(kitty.x + 15, kitty.y + 25); 
                ctx.scale(-1, 1); 
                ctx.font = "30px Arial";
                ctx.fillText("🐈", -15, 0); 
                ctx.restore(); 

                framesUntilNextSpawn--;
                
                if (framesUntilNextSpawn <= 0) {
                    let isDouble = Math.random() > 0.7 && score > 5; 
                    let maxScale = isDouble ? 0.9 : 1.3; 
                    let sizeMultiplier = 0.7 + (Math.random() * (maxScale - 0.7)); 
                    let baseSize = 25 * sizeMultiplier;
                    let baseSpeed = 4 + (score * 0.1);
                    let randomSpeedVariance = Math.random() * 1.5; 
                
                    obstacles.push({ 
                        x: canvas.width, 
                        y: isDouble ? 140 - (baseSize * 2) : 140 - baseSize, 
                        width: baseSize, 
                        height: isDouble ? baseSize * 2 : baseSize, 
                        speed: baseSpeed + randomSpeedVariance,
                        isDouble: isDouble,
                        size: baseSize 
                    });
                
                    let baseSpawnRate = Math.max(45, 90 - Math.floor(score * 2)); 
                    let randomGap = Math.floor(Math.random() * 40); 
                    framesUntilNextSpawn = baseSpawnRate + randomGap;
                }
                
                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    obs.x -= obs.speed; 
                
                    ctx.font = `${obs.size}px Arial`;
                    if (obs.isDouble) {
                        ctx.fillText("🧶", obs.x, obs.y + obs.size * 0.85); 
                        ctx.fillText("🧶", obs.x, obs.y + obs.size * 1.85); 
                    } else {
                        ctx.fillText("🧶", obs.x, obs.y + obs.size * 0.85); 
                    }
                
                    if (kitty.x < obs.x + obs.width - 5 &&
                        kitty.x + kitty.width - 5 > obs.x &&
                        kitty.y < obs.y + obs.height - 5 &&
                        kitty.height + kitty.y - 5 > obs.y) {
                        
                        isGameOver = true;
                        gameOverScreen.classList.remove('hidden');
                        finalScoreEl.innerText = score;
                        updateLeaderboard(score); 
                    }
                
                    if (obs.x + obs.width < 0) {
                        obstacles.splice(i, 1);
                        i--;
                        score++;
                    }
                }

                ctx.fillStyle = "#502c46";
                ctx.font = "bold 16px Arial";
                ctx.fillText("Score: " + score, canvas.width - 80, 25);

                ctx.beginPath();
                ctx.moveTo(0, 140);
                ctx.lineTo(canvas.width, 140);
                ctx.strokeStyle = "#80287a";
                ctx.lineWidth = 2;
                ctx.stroke();

                gameLoopId = requestAnimationFrame(gameLoop);
            }

            renderLeaderboard();
            initGame();

            // ==========================================
            // 6. MEDITATION STREAM LOGIC
            // ==========================================
            document.getElementById('stream-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('stream-wrapper').classList.toggle('open');
            });

            document.getElementById('meditation-stream').addEventListener('click', (e) => {
                const stream = document.getElementById('meditation-stream');
                const leaf = document.createElement('div');
                leaf.className = 'leaf';
                
                const natureEmojis = ['🍃', '🍂', '🍁'];
                leaf.innerText = natureEmojis[Math.floor(Math.random() * natureEmojis.length)];

                leaf.style.top = `${e.clientY}px`;
                leaf.style.left = `${e.clientX - 15 + (Math.random() * 10 - 5)}px`; 

                stream.appendChild(leaf);

                const distanceToBottom = window.innerHeight - e.clientY + 50; 
                const duration = distanceToBottom * 12; 

                leaf.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                    { opacity: 1, offset: 0.1 }, 
                    { opacity: 1, offset: 0.9 }, 
                    { transform: `translateY(${distanceToBottom}px) rotate(${distanceToBottom / 3}deg)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'linear',
                    fill: 'forwards'
                }).onfinish = () => leaf.remove(); 
            });

            setInterval(() => {
                const stream = document.getElementById('meditation-stream');
                if(!stream) return;
                
                const ripple = document.createElement('div');
                ripple.className = 'water-ripple';
                ripple.innerText = '~'; 
                
                ripple.style.left = `${Math.random() * 120 + 15}px`; 
                ripple.style.top = `-40px`; 
                
                stream.appendChild(ripple);

                const duration = 5000 + Math.random() * 4000; 
                ripple.animate([
                    { transform: 'translateY(0)', opacity: 0 },
                    { opacity: 1, offset: 0.2 },
                    { opacity: 1, offset: 0.8 },
                    { transform: `translateY(${window.innerHeight + 80}px)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'linear',
                    fill: 'forwards'
                }).onfinish = () => ripple.remove();
            }, 700); 
        });

               // ==========================================
        // 7. FLAPPY BEAN LOGIC
        // ==========================================
        const fbCanvas = document.getElementById('flappyGame');
        const fbCtx = fbCanvas.getContext('2d');
        const fbStartScreen = document.getElementById('fb-start-screen');
        const fbGameOverScreen = document.getElementById('fb-game-over-screen');
        const fbFinalScoreEl = document.getElementById('fb-final-score');

        let fbBean, fbPipes, fbScore, fbFrameCounter, fbLoopId, fbIsGameOver, fbIsGameStarted;

        // --- NEW: HIGH SCORE API LOGIC ---
        let fbGlobalHighScore = 0;
        const workerApiUrl = '/api/gamescore';
        
        async function fetchFlappyHighScore() {
            try {
                const response = await fetch(workerApiUrl);
                fbGlobalHighScore = parseInt(await response.text()) || 0;
                document.getElementById('fb-global-high').innerText = fbGlobalHighScore;
            } catch (error) {
                console.error("Could not load high score");
            }
        }
        
        // Fetch the score as soon as the page loads!
        fetchFlappyHighScore();
        // ---------------------------------

        function initFlappy() {
            fbBean = { x: 50, y: 150, width: 25, height: 25, dy: 0, gravity: 0.25, lift: -5 };
            fbIsGameStarted = false;
            fbIsGameOver = false;
            
            fbCtx.clearRect(0, 0, fbCanvas.width, fbCanvas.height);
            drawFbBean();
            
            fbStartScreen.style.display = 'flex';
            fbGameOverScreen.style.display = 'none';
        }

        function resetFlappy() {
            fbBean = { x: 50, y: 150, width: 25, height: 25, dy: 0, gravity: 0.25, lift: -5 };
            fbPipes = [];
            fbScore = 0;
            fbFrameCounter = 0;
            fbIsGameOver = false;
            fbIsGameStarted = true;
            
            fbStartScreen.style.display = 'none';
            fbGameOverScreen.style.display = 'none';
            
            cancelAnimationFrame(fbLoopId);
            flappyLoop();
        }

        function flap() {
            if (!fbIsGameStarted) {
                resetFlappy();
            } else if (fbIsGameOver) {
                resetFlappy();
            } else {
                fbBean.dy = fbBean.lift;
            }
        }

        // Event Listeners for Flappy Bean
        fbCanvas.addEventListener('mousedown', flap);
        fbCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, {passive: false});
        fbStartScreen.addEventListener('mousedown', flap);
        fbStartScreen.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, {passive: false});
        document.addEventListener('keydown', (e) => { 
            if (e.code === 'ArrowUp') {
                e.preventDefault(); // Stop page scrolling
                flap(); 
            }
        });

        function drawFbBean() {
            fbCtx.save(); 
            fbCtx.translate(fbBean.x + 15, fbBean.y + 20); 
            fbCtx.scale(-1, 1); // Flip cat to face right
            // Tilt the cat based on velocity
            let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (fbBean.dy * 0.1)));
            fbCtx.rotate(-rotation); 
            fbCtx.font = "26px Arial";
            fbCtx.fillText("🐈", -13, 0); 
            fbCtx.restore(); 
        }

        function flappyLoop() {
            if (fbIsGameOver || !fbIsGameStarted) return;
            
            fbCtx.clearRect(0, 0, fbCanvas.width, fbCanvas.height);
            fbFrameCounter++;

            // Bean Physics
            fbBean.dy += fbBean.gravity;
            fbBean.y += fbBean.dy;

            // Ceiling / Floor Collision
            if (fbBean.y + fbBean.height > fbCanvas.height || fbBean.y < 0) {
                triggerFbGameOver();
            }

            // Pipe Logic
            if (fbFrameCounter % 100 === 0) { // Every 100 frames, generate pipe
                let gap = 110; // Space between pipes
                let pipeWidth = 40;
                let minHeight = 40;
                let maxHeight = fbCanvas.height - gap - minHeight;
                let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
                
                fbPipes.push({
                    x: fbCanvas.width,
                    topHeight: topHeight,
                    bottomY: topHeight + gap,
                    width: pipeWidth,
                    passed: false
                });
            }

            for (let i = 0; i < fbPipes.length; i++) {
                let p = fbPipes[i];
                p.x -= 2.5; // Pipe speed

                // Draw Pipes
                fbCtx.fillStyle = "#8c7c5b";
                fbCtx.fillRect(p.x, 0, p.width, p.topHeight); // Top pipe
                fbCtx.fillRect(p.x, p.bottomY, p.width, fbCanvas.height - p.bottomY); // Bottom pipe
                
                // Add a small cap to the pipes for style
                fbCtx.fillStyle = "#726446";
                fbCtx.fillRect(p.x - 2, p.topHeight - 15, p.width + 4, 15);
                fbCtx.fillRect(p.x - 2, p.bottomY, p.width + 4, 15);

                // Pipe Collision Detection (Updated with a forgiving hitbox)
                let hitMargin = 5; // Shaves 5 pixels off all sides of the cat's hitbox
        
                if (fbBean.x + hitMargin < p.x + p.width && fbBean.x + fbBean.width - hitMargin > p.x) {
                    if (fbBean.y + hitMargin < p.topHeight || fbBean.y + fbBean.height - hitMargin > p.bottomY) {
                        triggerFbGameOver();
                    }
                }

                // Score Tracking
                if (p.x + p.width < fbBean.x && !p.passed) {
                    fbScore++;
                    p.passed = true;
                }

                // Remove off-screen pipes
                if (p.x + p.width < 0) {
                    fbPipes.splice(i, 1);
                    i--;
                }
            }

            drawFbBean();

            // Draw Score
            fbCtx.fillStyle = "#502c46";
            fbCtx.font = "bold 24px Arial";
            fbCtx.fillText(fbScore, fbCanvas.width / 2 - 10, 35);

            fbLoopId = requestAnimationFrame(flappyLoop);
        }

        // --- NEW: UPDATED GAME OVER LOGIC ---
        function triggerFbGameOver() {
            fbIsGameOver = true;
            fbGameOverScreen.style.display = 'flex';
            fbFinalScoreEl.innerText = fbScore;

            // Check if they beat the global high score!
            if (fbScore > fbGlobalHighScore) {
                fbGlobalHighScore = fbScore;
                document.getElementById('fb-global-high').innerText = fbGlobalHighScore; // Update UI instantly
                
                // Quietly send the new score to the Cloudflare Worker in the background
                fetch(workerApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ score: fbScore })
                }).catch(err => console.error("Failed to save high score"));
            }
        }
        // -------------------------------------

        initFlappy();
