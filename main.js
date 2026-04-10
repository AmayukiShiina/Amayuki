const cubism4Model =
  "Model/Amayuki1/amayuki.model3.json";

const config = {
    angel: { 
        name: "天雪", 
        birth: "09 / 21", 
        race: "天使", 
        bio: "「願這場冬雪，能洗淨世間所有的哀愁。」", 
        color: "#0369a1", 
        aboutTitle: "關於天雪", 
        aboutDesc: "這裡是天雪。喜歡深夜的寂靜，希望能透過歌聲溫暖迷路的靈魂。",
        links: {
            linkYt: "https://www.youtube.com/@AmayukiShiina",
            linkX: "https://x.com/Shiina_Amayuk1",
            linkTw: "https://www.twitch.tv/amayukishiina",
            linkIg: "https://www.instagram.com/amayuki_shiina/",
            linkTk: "https://www.tiktok.com/@amayukishiina"
        }
    },
    demon: { 
        name: "夕納", 
        birth: "09 / 16", 
        race: "惡魔", 
        bio: "「讓紅色的雪蓋過一切吧，靈魂什麼的...不需要喔。」", 
        color: "#f87171", 
        aboutTitle: "關於夕納", 
        aboutDesc: "夕納。紅色的雪並不是悲傷，而是極致的狂歡。沒打算放你走喔。",
        links: {
            linkYt: "https://www.youtube.com/@AmayukiShiina",
            linkX: "https://x.com/Shiina_Amayuk1",
            linkTw: "https://www.twitch.tv/amayukishiina",
            linkIg: "https://www.instagram.com/amayuki_shiina/",
            linkTk: "https://www.tiktok.com/@amayukishiina"
        }
    }
    };

/**
 * 更新頁面視覺與內容模式
 * @param {string} mode - 'angel' | 'demon'
 */
function updateMode(mode) {
    const data = config[mode];
    const isDemon = mode === 'demon';

    // 1. 更新容器狀態與顏色
    const stage = document.getElementById('mainStage');
    const menuBtn = document.getElementById('menuBtn');
    const connectTitle = document.getElementById('connectTitle');
    
    stage.classList.toggle('is-demon', isDemon);
    
    if (menuBtn) {
        menuBtn.style.color = data.color;
        menuBtn.style.borderColor = `${data.color}66`;
    }
    
    if (connectTitle) connectTitle.style.color = data.color;

    // 2. 更新內容文字
    const updateMap = {
        'bgTitle': data.name,
        'nameDisplay': data.name,
        'birthVal': data.birth,
        'raceVal': data.race,
        'bioText': data.bio,
        'aboutTitle': data.aboutTitle,
        'aboutContent': data.aboutDesc
    };

    if (window.myModel) {
        if (mode === 'demon') {
            window.myModel.expression("Wings");
        } else {
            window.myModel.expression("Rings");
        }
    }

    Object.entries(updateMap).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
        if (id === 'aboutContent') el.innerHTML = value;
        else el.innerText = value;
        }
    });

    // 3. 更新社群連結
    Object.entries(data.links).forEach(([id, url]) => {
        const el = document.getElementById(id);
        if (el) {
        el.href = url;
        el.target = "_blank";
        el.style.color = data.color;
        }
    });
    }

/**
 * 控制導覽門戶開關
 * @param {boolean} open 
 */
function togglePortal(open) {
    const portal = document.getElementById('nav-portal');
    if (!portal) return;

    if (open) {
        portal.style.display = 'flex';
        // 延遲以觸發 CSS Transition
        requestAnimationFrame(() => portal.classList.add('active'));
    } else {
        portal.classList.remove('active');
        setTimeout(() => { portal.style.display = 'none'; }, 500);
    }
    }
async function PixiLive() {
    const canvasElement = document.getElementById("canvas");
    const app = new PIXI.Application({
        view: document.getElementById("canvas"),
        autoStart: true,
        resizeTo: window,
        transparent: true, // 建議開啟透明，以免遮住背景文字
        backgroundAlpha: 0,
        antialias: true
    });

    try {
        const model4 = await PIXI.live2d.Live2DModel.from(cubism4Model);
        window.myModel = model4;
        app.stage.addChild(model4);
        
        model4.expression("Rings");
        model4.autoInteract = false;
        
        // 基礎設定
        model4.scale.set(0.25);
        model4.anchor.set(0.5, 0.5);
        const updatePosition = () => {
            model4.x = window.innerWidth * 0.5;
            model4.y = window.innerHeight * 0.5;
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        /*/ --- 強化版滑鼠監聽 ---
        const handlePointerMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // 計算距離中心點的位移
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distX = mouseX - centerX;
            const distY = mouseY - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // 判斷半徑，建議設大一點點（例如 250）觀察效果
            const deadZoneRadius = 250;

            if (distance < deadZoneRadius) {
                // 【關鍵 1】在中間時，強制關閉自動互動
                model4.autoInteract = false;
            } else {
                // 離開中間，恢復自動追隨
                model4.autoInteract = true;
            }
        };

        window.addEventListener('mousemove', handlePointerMove);
        model4.autoInteract = false; 
        model4.focus(window.innerWidth / 2, window.innerHeight / 2);*/

    } catch (error) {
        console.error("Live2D 載入錯誤:", error);
    }
}



    // 頁面初始化
    document.addEventListener('DOMContentLoaded', () => {
        updateMode('angel');
        PixiLive();
    });