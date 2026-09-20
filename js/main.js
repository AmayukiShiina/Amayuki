
/* =========================================
   天雪シイナ Official Website
   Live2D Character Switch Controller
========================================= */


/* =========================================
   1. MODEL CONFIG
========================================= */

// 修改成你的新模型路徑
const cubism4Model =
    "Model/Shiina/Shiina.model3.json";

// 轉換 Motion 群組名稱
const MOTIONS = {

    angel: "ToAngel",

    demon: "ToDemon"

};

// 初始角色
const INITIAL_MODE = "angel";

// 模型縮放比例
const MODEL_SCALE = 0.20;


/* =========================================
   2. CHARACTER DATA
========================================= */

const config = {

    angel: {

        name: "天雪",

        birth: "09 / 21",

        race: "天使",

        bio:
            "「願這場冬雪，能洗淨世間所有的哀愁。」",

        color: "#0369a1",

        aboutTitle: "關於天雪",

        aboutDesc:
            "這裡是天雪。喜歡深夜的寂靜，希望能透過歌聲溫暖迷路的靈魂。",

        links: {

            linkYt:
                "https://www.youtube.com/@AmayukiShiina",

            linkX:
                "https://x.com/Shiina_Amayuk1",

            linkTw:
                "https://www.twitch.tv/amayukishiina",

            linkIg:
                "https://www.instagram.com/amayuki_shiina/",

            linkTk:
                "https://www.tiktok.com/@amayukishiina"

        }

    },

    demon: {

        name: "夕納",

        birth: "09 / 21",

        race: "惡魔",

        bio:
            "「讓紅色的雪蓋過一切吧，靈魂什麼的...不需要喔。」",

        color: "#f87171",

        aboutTitle: "關於夕納",

        aboutDesc:
            "夕納。紅色的雪並不是悲傷，而是極致的狂歡。沒打算放你走喔。",

        links: {

            linkYt:
                "https://www.youtube.com/@AmayukiShiina",

            linkX:
                "https://x.com/Shiina_Amayuk1",

            linkTw:
                "https://www.twitch.tv/amayukishiina",

            linkIg:
                "https://www.instagram.com/amayuki_shiina/",

            linkTk:
                "https://www.tiktok.com/@amayukishiina"

        }

    }

};


/* =========================================
   3. GLOBAL STATE
========================================= */

let currentMode = INITIAL_MODE;

let modelReady = false;

let isTransforming = false;

let portalTimer = null;

window.myModel = null;

window.pixiApp = null;


/* =========================================
   4. UPDATE WEBSITE THEME
========================================= */

function updateMode(mode) {

    const data = config[mode];

    if (!data) return;


    /* ---------- Stage ---------- */

    const stage =
        document.getElementById("mainStage");

    if (stage) {

        stage.classList.toggle(
            "is-demon",
            mode === "demon"
        );

    }


    /* ---------- Menu Button ---------- */

    const menuBtn =
        document.getElementById("menuBtn");

    if (menuBtn) {

        menuBtn.style.color = data.color;

        menuBtn.style.borderColor =
            `${data.color}66`;

    }


    /* ---------- Social Title ---------- */

    const connectTitle =
        document.getElementById("connectTitle");

    if (connectTitle) {

        connectTitle.style.color = data.color;

    }


    /* ---------- Content ---------- */

    const content = {

        bgTitle: data.name,

        nameDisplay: data.name,

        birthVal: data.birth,

        raceVal: data.race,

        bioText: data.bio,

        aboutTitle: data.aboutTitle,

        aboutContent: data.aboutDesc

    };


    Object.entries(content).forEach(
        ([id, value]) => {

            const element =
                document.getElementById(id);

            if (!element) return;

            element.textContent = value;

        }
    );


    /* ---------- Social Links ---------- */

    Object.entries(data.links).forEach(
        ([id, url]) => {

            const element =
                document.getElementById(id);

            if (!element) return;

            element.href = url;

            element.target = "_blank";

            element.rel =
                "noopener noreferrer";

            element.style.color = data.color;

        }
    );


    /* ---------- Character Cards ---------- */

    updateCharacterCards(mode);

}


/* =========================================
   5. CHARACTER CARD UI
========================================= */


function updateCharacterCards(mode) {

    const card = document.getElementById("characterToggle");

    if (!card) return;

    // 顯示下一個可以切換的角色
    const targetMode = mode === "angel"
        ? "demon"
        : "angel";

    card.dataset.mode = targetMode;

    const icon = card.querySelector(
        ".character-option-icon"
    );

    const iconElement = icon?.querySelector("i");

    const subtitle = card.querySelector(
        ".character-option-subtitle"
    );

    const name = card.querySelector(
        ".character-option-name"
    );

    if (targetMode === "demon") {

        if (icon) {
            icon.className =
                "character-option-icon demon-icon";
        }

        if (iconElement) {
            iconElement.className =
                "fa-solid fa-moon";
        }

        if (subtitle) {
            subtitle.textContent = "SWITCH TO DEMON";
        }

        if (name) {
            name.textContent = "切換至夕納";
        }

    } else {

        if (icon) {
            icon.className =
                "character-option-icon angel-icon";
        }

        if (iconElement) {
            iconElement.className =
                "fa-solid fa-snowflake";
        }

        if (subtitle) {
            subtitle.textContent = "SWITCH TO ANGEL";
        }

        if (name) {
            name.textContent = "切換至天雪";
        }

    }

    card.setAttribute(
        "aria-label",
        targetMode === "demon"
            ? "切換至夕納"
            : "切換至天雪"
    );

    card.setAttribute("aria-pressed", "false");

    card.classList.remove("selected");

}


/* =========================================
   6. LOCK CHARACTER CARDS
========================================= */

function lockCharacterCards(locked) {

    const cards =
        document.querySelectorAll(
            ".character-option[data-mode]"
        );


    cards.forEach(card => {

        card.disabled = locked;

        card.classList.toggle(
            "is-transforming",
            locked
        );

    });

}



async function switchCharacter(targetMode) {

    // 檢查角色是否存在
    if (!config[targetMode]) return;

    // 防止重複切換
    if (isTransforming) return;

    // 已經是目前角色
    if (targetMode === currentMode) return;

    
    /* =========================================
    清除 Live2D 變身特效
    ========================================= */

    function clearTransformationEffect() {

        if (!window.myModel) return;

        const core =
            window.myModel.internalModel.coreModel;

        // 恢復特效參數
        core.setParameterValueById("toggle_21", 0);
        core.setParameterValueById("toggle_22", -10);

        console.log("Live2D 變身特效已清除");

    }


    /* =====================================
       1. 立即切換網站背景及內容
    ===================================== */

    currentMode = targetMode;

    updateMode(targetMode);

    console.log("網站主題已切換:", targetMode);


    /* =====================================
       2. 檢查 Live2D
    ===================================== */

    if (!modelReady || !window.myModel) {

        console.warn(
            "Live2D 尚未載入，網站主題已正常切換"
        );

        return;

    }


    const model = window.myModel;

    const manager =
        model.internalModel.motionManager;

    const motionGroup =
        MOTIONS[targetMode];


    /* =====================================
       3. 檢查 Motion
    ===================================== */

    const definitions =
        manager.definitions || {};


    if (
        !definitions[motionGroup] ||
        definitions[motionGroup].length === 0
    ) {

        console.warn(
            `找不到 ${motionGroup}，但網站主題已切換`
        );

        return;

    }


    /* =====================================
       4. 播放變身動畫
    ===================================== */

    isTransforming = true;

    lockCharacterCards(true);

    let timeoutId = null;

    let completed = false;


    const cleanup = () => {

        if (completed) return;

        completed = true;

        manager.off(
            "motionFinish",
            onMotionFinish
        );

        if (timeoutId !== null) {

            clearTimeout(timeoutId);

            timeoutId = null;

        }

        isTransforming = false;

        lockCharacterCards(false);

    };



    const onMotionFinish = () => {

        // 動畫播放結束
        cleanup();

        // 清除殘留特效
        clearTransformationEffect();

        console.log(
            "Live2D 變身完成，特效已清除"
        );

    };


    try {

        manager.on(
            "motionFinish",
            onMotionFinish
        );


        // 防止 Motion 沒有結束事件時永久鎖定
        timeoutId = setTimeout(() => {

            console.warn(
                "Motion 等待逾時，解除卡片鎖定"
            );

            cleanup();

        }, 20000);


        // 播放變身動畫
        const started = await model.motion(
            motionGroup,
            0,
            3
        );


        if (!started) {

            console.warn(
                `Motion 無法播放: ${motionGroup}`
            );

            cleanup();

        }

    } catch (error) {

        console.error(
            "Live2D 動畫錯誤:",
            error
        );

        cleanup();

    }

}


/* =========================================
   8. CHARACTER CARD EVENTS
========================================= */

function initCharacterCards() {

    const cards =
        document.querySelectorAll(
            ".character-option[data-mode]"
        );


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const mode =
                    card.dataset.mode;

                switchCharacter(mode);

            }
        );

    });


    updateCharacterCards(currentMode);

}


/* =========================================
   9. NAVIGATION PORTAL
========================================= */

function togglePortal(open) {

    const portal =
        document.getElementById(
            "nav-portal"
        );


    if (!portal) return;


    /* ---------- Cancel Timer ---------- */

    if (portalTimer !== null) {

        clearTimeout(portalTimer);

        portalTimer = null;

    }


    /* ---------- Open ---------- */

    if (open) {

        portal.style.display = "flex";


        requestAnimationFrame(() => {

            portal.classList.add(
                "active"
            );

        });

    }


    /* ---------- Close ---------- */

    else {

        portal.classList.remove(
            "active"
        );


        portalTimer = setTimeout(() => {

            portal.style.display = "none";

            portalTimer = null;

        }, 500);

    }

}


/* =========================================
   10. LIVE2D INITIALIZATION
========================================= */

async function PixiLive() {

    const canvasElement =
        document.getElementById(
            "canvas"
        );


    if (!canvasElement) {

        console.error(
            "找不到 Live2D Canvas"
        );

        return;

    }


    /* ---------- Check Libraries ---------- */

    if (
        typeof PIXI === "undefined" ||
        !PIXI.live2d
    ) {

        console.error(
            "PIXI 或 pixi-live2d-display 尚未載入"
        );

        return;

    }


    /* ---------- PIXI Application ---------- */

    const app =
        new PIXI.Application({

            view: canvasElement,

            autoStart: true,

            resizeTo: window,

            transparent: true,

            backgroundAlpha: 0,

            antialias: true

        });


    window.pixiApp = app;


    try {

        /* ---------- Load Model ---------- */

        const model =
            await PIXI.live2d.Live2DModel.from(
                cubism4Model,
                {

                    autoInteract: false,

                    autoUpdate: true,

                    motionPreload: "ALL"

                }
            );


        window.myModel = model;


        /* ---------- Add Model ---------- */

        app.stage.addChild(model);


        /* ---------- Disable Mouse Interaction ---------- */

        model.autoInteract = false;


        /* ---------- Model Scale ---------- */

        model.scale.set(
            MODEL_SCALE
        );


        /* ---------- Anchor ---------- */

        model.anchor.set(
            0.5,
            0.5
        );


        /* ---------- Position ---------- */

        const updatePosition = () => {

            model.x = app.screen.width * 0.5;

            // 數值越小，人物越往上
            model.y = app.screen.height * 0.25;

        };


        updatePosition();


        window.addEventListener(
            "resize",
            updatePosition
        );


        /* ---------- Motion Manager ---------- */

        const manager =
            model.internalModel.motionManager;


        const motions =
            manager.definitions || {};


        console.log(
            "可用 Motion:",
            Object.keys(motions)
        );


        /* ---------- Motion Check ---------- */

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


        /* ---------- Model Ready ---------- */

        modelReady = true;


        console.log(
            "Live2D 模型載入完成"
        );


    } catch (error) {

        modelReady = false;

        console.error(
            "Live2D 模型載入失敗:",
            error
        );

    }

}


/* =========================================
   11. INITIALIZE WEBSITE
========================================= */

function initWebsite() {

    /* ---------- Initial Theme ---------- */

    currentMode = INITIAL_MODE;

    updateMode(currentMode);


    /* ---------- Character Cards ---------- */

    initCharacterCards();


    /* ---------- Live2D ---------- */

    PixiLive();

}


/* =========================================
   12. GLOBAL FUNCTIONS
========================================= */

window.switchCharacter =
    switchCharacter;

window.togglePortal =
    togglePortal;


/* =========================================
   13. DOM READY
========================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initWebsite,
        {
            once: true
        }
    );

} else {

    initWebsite();

}