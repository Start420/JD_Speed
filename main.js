setScreenMetrics(1080, 2248);
console.show()
var width = device.width
var height = device.height
var 仓库名 = "JD_Speed"     //需要更换仓库名
var 脚本文件夹 = 仓库名 + "/" + 仓库名 + "-main"
//请求截图
if (!requestScreenCapture()) {
    toastLog("请求截图失败");
    exit();
};

// watchVideo();
task();
look();
//判断今日已完成是否存在
function isEnd() {
    var isEnd = text('今日已完成').findOne(2000);
    if (isEnd) {
        return true;
    }
    return false;
};
//看视频
function watchVideo() {
    app.launchPackage("com.jd.jdlite")
    sleep(5000)
    var centerBtn = desc("看看").findOne().parent();
    var x = centerBtn.bounds().centerX();
    var y = centerBtn.bounds().centerY();
    click(x, y);
    captureScreen("/sdcard/当前截图.png");
    sleep(1000)
    var img = images.read("/sdcard/当前截图.png");
    var templ = images.read(脚本文件夹 + "看看.png");
    var p = findImage(img, templ);
    sleep(800)
    toastLog(click(p + templ.getWidth() / 2, p + templ.getHeight() / 2));
    toastLog("视频任务开始");
    if (isEnd()) {
        toastLog('识别到今日已完成，结束看视频');
    } else {
        toastLog("正在观看小视频")
        var a
        for (a = 1; a < 100; a++) {
            toastLog("按钮存在>>>>\n浏览第" + a + "个视频")
            sleep(random(15000, 18000))
            swipe(random(540, 640), height - 400, random(760, 860), random(200, 300), 500)
            if (id("task_float_fengkong_goon").exists()) {
                click(id("task_float_fengkong_goon"))
            };
            if (isEnd()) {
                toastLog('识别到今日已完成，结束看视频');
                break;
            };
        };
    };
};
//进入任务列表
function task() {
    app.launchPackage("com.jd.jdlite")
    sleep(3000)
    var centerBtn = desc("赚钱").findOne().parent();
    var x = centerBtn.bounds().centerX();
    var y = centerBtn.bounds().centerY();
    click(x, y);
    sleep(800)
    captureScreen("/sdcard/当前截图.png");
    sleep(1000)
    var img = images.read("/sdcard/当前截图.png");
    var path = files.join(脚本文件夹, "赚金币.png")
    log(path)
    var templ = images.read(path);
    var p = findImage(img, templ);
    if (p) {
        toastLog("进入任务列表" + p.x + "," + p.y);
        click(p.x + templ.getWidth() / 2, p.y + templ.getHeight() / 2)
        toastLog("任务列表存在")
    } else {
        toastLog("没找到");
        stopApp();
        sleep(1500)
        task();
    }
};
//看商品
function look() {
    sleep(500)
    toastLog("开始逛商品|活动")
    click("去赚钱", 0)
    //准备进入循环体
    var a, b
    for (a = 1; a < 65; a++) {
        toastLog("正在浏览第" + a + "个")
        sleep(6000)
        for (b = 1; b < 4; b++) {
            swipe(random(540, 640), height - 400, random(760, 860), random(200, 300), random(800, 1000))
            sleep(random(1000, 1500))
        };
        back();
        sleep(800)
        click("去赚钱", 0)
        if (isEnd()) {
            toastLog('识别到今日已完成，结束该任务');
            break;
        };
    };
};

function lookTask() {
    sleep(500)
    toastLog("开始逛活动")
    click("去赚钱", 0)
    //准备进入循环体
    var a
    for (a = 1; a < 15; a++) {
        toastLog("正在浏览第" + a + "个活动")
        sleep(9000)
        for (b = 1; b < 5; b++) {
            swipe(random(540, 640), height - 400, random(760, 860), random(200, 300), random(800, 1000))
            sleep(random(800, 1200))
        };
        back();
        sleep(800)
        click("去赚钱", 0)
        // toastLog(id("ll_task_bottom_next").findOne().click());
        if (isEnd()) {
            toastLog('识别到今日已完成，结束该任务');
            break;
        };
    };
}

function stopApp() {
    let packageName = currentPackage();
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
    if (is_sure.enabled()) {
        textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
        sleep(1000);
        className("android.widget.Button").text("确定").findOne().click()
        toastLog(app.getAppName(packageName) + "已强行停止");
        sleep(1500);
        back();
    } else {
        toastLog(app.getAppName(packageName) + "不能被正常关闭或不在后台运行");
        home();
    };
};
