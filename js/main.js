
/* =========================================
   天雪シイナ Official Website
   Angel / Demon Live2D Controller
========================================= */

/* =========================================
   1. Live2D 模型路徑
========================================= */

// 如果新模型檔名不同，只需要修改這一行
const cubism4Model = "Model/Shiina/Shiina.model3.json";


/* =========================================
   2. 角色資料
========================================= */

const config = {

    angel: {

        name: "天雪",
        birth: "09 / 21",
        race: "天使",

        bio: "「願這場冬雪，能洗淨世間所有的哀愁。」",

        color: "#0369a1",

        aboutTitle: "關於天雪",

        aboutDesc:
            "這裡是天雪。喜歡深夜的寂靜，希望能透過歌聲溫暖迷路的靈魂。",

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
        birth: "09 / 21",
        race: "惡魔",

        bio: "「讓紅色的雪蓋過一切吧，靈魂什麼的...不需要喔。」",

        color: "#f87171",

        aboutTitle: "關於夕納",

        aboutDesc:
            "夕納。紅色的雪並不是悲傷，而是極致的狂歡。沒打算放你走喔。",

        links: {

            linkYt: "https://www.youtube.com/@AmayukiShiina",

            linkX: "https://x.com/Shiina_Amayuk1",

            linkTw: "https://www.twitch.tv/amayukishiina",

            linkIg: "https://www.instagram.com/amayuki_shiina/",

            linkTk: "https://www.tiktok.com/@amayukishiina"

        }

    }

};


/* =========================================
   3. 全域狀態
========================================= */

// 網站初始角色
let currentMode = "angel";

// 是否正在進行角色轉換
let isTransforming = false;

// Live2D 是否已完成載入
let modelReady = false;

// 導覽選單計時器
let portalTimer = null;

// 儲存模型供其他功能使用
window.myModel = null;


/* =========================================
   4. 更新網頁主題與內容
========================================= */

function updateMode(mode) {

    const data = config[mode];

    if (!data) {
        console.error("未知角色模式:", mode);
        return;
    }

    const isDemon = mode === "demon";


    /* ---------- 網站主題 ---------- */

    const stage = document.getElementById("mainStage");

    const menuBtn = document.getElementById("menuBtn");

    const connectTitle = document.getElementById("connectTitle");


    if (stage) {

        stage.classList.toggle("is-demon", isDemon);

    }


    if (menuBtn) {

        menuBtn.style.color = data.color;

        menuBtn.style.borderColor = `${data.color}66`;

    }


    if (connectTitle) {

        connectTitle.style.color = data.color;

    }


    /* ---------- 角色文字 ---------- */

    const updateMap = {

        bgTitle: data.name,

        nameDisplay: data.name,

        birthVal: data.birth,

        raceVal: data.race,

        bioText: data.bio,

        aboutTitle: data.aboutTitle,

        aboutContent: data.aboutDesc

    };


    Object.entries(updateMap).forEach(([id, value]) => {

        const element = document.getElementById(id);

        if (!element) return;

        element.textContent = value;

    });


    /* ---------- 社群連結 ---------- */

    Object.entries(data.links).forEach(([id, url]) => {

        const element = document.getElementById(id);

        if (!element) return;

        element.href = url;

        element.target = "_blank";

        element.rel = "noopener noreferrer";

        element.style.color = data.color;

    });


    /* ---------- 更新右側角色卡片 ---------- */

    updateCharacterCards(mode);

}


/* =========================================
   5. 更新角色卡片狀態
========================================= */

function updateCharacterCards(mode) {

    const cards = document.querySelectorAll(
        "[data-mode]"
    );


    cards.forEach(card => {

        const isSelected =
            card.dataset.mode === mode;


        card.classList.toggle(
            "selected",
            isSelected
        );


        card.classList.toggle(
            "active",
            isSelected
        );


        // 無障礙選取狀態
        card.setAttribute(
            "aria-pressed",
            String(isSelected)
        );

    });

}


/* =========================================
   6. 鎖定 / 解鎖角色卡片
========================================= */

function setCharacterCardsLocked(locked) {

    const cards = document.querySelectorAll(
        "[data-mode]"
    );


    cards.forEach(card => {

        card.classList.toggle(
            "is-transforming",
            locked
        );


        // 如果是 button，直接禁止點擊
        if (card instanceof HTMLButtonElement) {

            card.disabled = locked;

        }

    });

}


/* =========================================
   7. Live2D 角色轉換
========================================= */

/**
 * angel -> demon
 * White to Black.motion3.json
 *
 * demon -> angel
 * Black to White.motion3.json
 */

async function switchCharacter(targetMode) {

    // 不存在的角色
    if (!config[targetMode]) return;

    // 模型還沒載入
    if (!modelReady || !window.myModel) {

        console.warn(
            "Live2D 尚未載入完成"
        );

        return;

    }

    // 動畫進行中不可再次切換
    if (isTransforming) return;

    // 已經是當前角色，不需要切換
    if (currentMode === targetMode) return;


    const model = window.myModel;

    const motionManager =
        model.internalModel.motionManager;


    /* ---------- 決定轉換動畫 ---------- */

    const motionGroup =
        targetMode === "demon"
            ? "ToDemon"
            : "ToAngel";


    /* ---------- 檢查 Motion 是否存在 ---------- */

    const motionDefinitions =
        motionManager.definitions ||
        model.internalModel.settings?.motions;


    if (
        !motionDefinitions ||
        !motionDefinitions[motionGroup] ||
        motionDefinitions[motionGroup].length === 0
    ) {

        console.error(
            `找不到 Motion 群組：${motionGroup}`
        );

        return;

    }


    /* ---------- 開始轉換 ---------- */

    isTransforming = true;

    setCharacterCardsLocked(true);


    console.log(
        `角色轉換開始：${currentMode} -> ${targetMode}`
    );


    let watchdog = null;

    let finished = false;


    /* ---------- 清理動畫監聽 ---------- */

    const cleanup = () => {

        motionManager.off(
            "motionFinish",
            onMotionFinish
        );

        if (watchdog !== null) {

            clearTimeout(watchdog);

            watchdog = null;

        }

        isTransforming = false;

        setCharacterCardsLocked(false);

    };


    /* ---------- 動畫正常結束 ---------- */

    const completeTransformation = () => {

        if (finished) return;

        finished = true;

        cleanup();


        // 動畫完成後，才正式更新角色
        currentMode = targetMode;

        updateMode(targetMode);


        console.log(
            `角色轉換完成：${currentMode}`
        );

    };


    /* ---------- 動畫結束事件 ---------- */

    const onMotionFinish = (group, index) => {

        if (group !== motionGroup) return;

        if (index !== 0) return;

        completeTransformation();

    };


    try {

        // 先註冊動畫結束事件
        motionManager.on(
            "motionFinish",
            onMotionFinish
        );


        // FORCE Priority = 3
        // 讓轉換動畫可以覆蓋一般待機動畫
        const started = await model.motion(
            motionGroup,
            0,
            3
        );


        /* ---------- 動畫啟動失敗 ---------- */

        if (!started) {

            throw new Error(
                `Motion 無法啟動：${motionGroup}`
            );

        }


        // 正常情況下由 motionFinish 結束轉換。
        // 20 秒內仍未結束時解除鎖定，避免卡片永久失效。
        if (!finished) {

            watchdog = setTimeout(() => {

                if (finished) return;

                finished = true;

                cleanup();

                console.error(
                    `Motion 未正常結束：${motionGroup}`
                );

            }, 20000);

        }

    } catch (error) {

        console.error(
            "Live2D 角色轉換失敗:",
            error
        );

        if (!finished) {

            finished = true;

            cleanup();

        }

    }

}


/* =========================================
   8. 提供給 HTML onclick 使用
========================================= */

// 即使原本 HTML 是用 onclick 呼叫，
// 也能使用以下公開函式。

window.switchCharacter = switchCharacter;


/* =========================================
   9. 初始化右側角色卡片
========================================= */

function initCharacterCards() {

    const cards = document.querySelectorAll(
        "[data-mode]"
    );


    cards.forEach(card => {

        const mode = card.dataset.mode;


        if (!config[mode]) return;


        // 避免重複綁定
        if (card.dataset.bound === "true") return;

        card.dataset.bound = "true";


        // 卡片點擊
        card.addEventListener("click", () => {

            switchCharacter(mode);

        });


        // 非 button 的卡片也可以使用鍵盤操作
        if (!(card instanceof HTMLButtonElement)) {

            card.setAttribute(
                "role",
                "button"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        switchCharacter(mode);

                    }

                }
            );

        }

    });


    updateCharacterCards(currentMode);

}


/* =========================================
   10. 導覽門戶開關
========================================= */

function togglePortal(open) {

    const portal = document.getElementById(
        "nav-portal"
    );


    if (!portal) return;


    // 清除上一個關閉計時器
    if (portalTimer !== null) {

        clearTimeout(portalTimer);

        portalTimer = null;

    }


    if (open) {

        portal.style.display = "flex";


        requestAnimationFrame(() => {

            portal.classList.add("active");

        });

    } else {

        portal.classList.remove("active");


        portalTimer = setTimeout(() => {

            portal.style.display = "none";

            portalTimer = null;

        }, 500);

    }

}


// 允許原本 HTML onclick 使用
window.togglePortal = togglePortal;


/* =========================================
   11. 初始化 Live2D
========================================= */

async function PixiLive() {

    const canvasElement = document.getElementById(
        "canvas"
    );


    if (!canvasElement) {

        console.error(
            "找不到 canvas 元素"
        );

        return;

    }


    /* ---------- 建立 PIXI ---------- */

    const app = new PIXI.Application({

        view: canvasElement,

        autoStart: true,

        resizeTo: window,

        transparent: true,

        backgroundAlpha: 0,

        antialias: true

    });


    // 保留 PIXI instance
    window.pixiApp = app;


    try {

        /* ---------- 載入 Live2D ---------- */

        const model4 =
            await PIXI.live2d.Live2DModel.from(
                cubism4Model,
                {
                    autoInteract: false
                }
            );


        window.myModel = model4;


        /* ---------- 加入舞台 ---------- */

        app.stage.addChild(model4);


        /* ---------- 關閉滑鼠自動互動 ---------- */

        model4.autoInteract = false;


        // 移除模型內建的自動互動監聽
        // 不再使用滑鼠追蹤或模型點擊來切換角色


        /* ---------- 基礎設定 ---------- */

        model4.scale.set(0.25);

        model4.anchor.set(0.5, 0.5);


        /* ---------- 模型位置 ---------- */

        const updatePosition = () => {

            model4.x =
                app.screen.width * 0.5;

            model4.y =
                app.screen.height * 0.5;

        };


        updatePosition();


        window.addEventListener(
            "resize",
            updatePosition
        );


        /* ---------- 模型準備完成 ---------- */

        modelReady = true;


        console.log(
            "Live2D 模型載入完成"
        );


        /* ---------- 檢查轉換 Motion ---------- */

        const motionManager =
            model4.internalModel.motionManager;


        const motions =
            motionManager.definitions ||
            model4.internalModel.settings?.motions ||
            {};


        console.log(
            "可用 Motion:",
            Object.keys(motions)
        );


        if (!motions.ToAngel) {

            console.warn(
                "缺少 ToAngel Motion"
            );

        }


        if (!motions.ToDemon) {

            console.warn(
                "缺少 ToDemon Motion"
            );

        }


        // 初始角色為天雪。
        // 假設模型本身的初始外觀已經是白色天雪。
        // 不主動播放轉換動畫，避免進站時自動變身。

    } catch (error) {

        modelReady = false;

        console.error(
            "Live2D 載入錯誤:",
            error
        );

    }

}


/* =========================================
   12. 頁面初始化
========================================= */

function initWebsite() {

    /* ---------- 初始化天雪模式 ---------- */

    currentMode = "angel";

    updateMode(currentMode);


    /* ---------- 初始化角色卡片 ---------- */

    initCharacterCards();


    /* ---------- 載入 Live2D ---------- */

    PixiLive();

}


/* ---------- 等待 DOM 載入 ---------- */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initWebsite,
        { once: true }
    );

} else {

    initWebsite();

}