setScreenMetrics(1080, 2248);
console.show()
var width = device.width
var height = device.height
var 仓库名 = "JD_Speed"     //需要更换仓库名
var 脚本文件夹 = "/sdcard/KirkJs/" + 仓库名 + "/" + 仓库名 + "-main"
//请求截图
if (!requestScreenCapture()) {
    toastLog("请求截图失败");
    exit();
};
function init() {
    events.observeKey();
    events.on("key", function (keyCode, event) {
        if (keyCode == keys.volume_up) {
            toastLog("音量上键按下,结束脚本");
            exit();
        }
    });
};
main();
function main() {
    init();
    task();
    //判断任务是否需要执行
    toastLog("判断任务是否需要执行")
    var btn;
    var i = 1;
    while (btn = findTaskBtn(1)) {
        doShopTask();
        toastLog('第' + i + '次看商品完成');
        if (++i > 100) {
            break;
        }
    }
    toastLog('商品任务结束');
    i = 1;
    while (btn = findTaskBtn(2)) {
        doActiveTask();
        toastLog('第' + i + '次看活动完成');
        if (++i > 30) {
            break;
        }
    }
    toastLog('活动任务结束');
    if (btn = findTaskBtn(3)) {
        toastLog('正在执行看视频任务');
        doVideoTask();
    }
    toastLog('视频任务结束');
    sleep(1500)
    back();
    exit();

};
//进入任务列表
function task() {
    log("脚本已启动，请等待...")
    if (currentPackage() !== app.getPackageName("京东极速版")) {
        app.launchPackage("com.jd.jdlite")
        sleep(4000)
    };
    console.hide();
    var earnCoin = "https://gitee.com/Kirk678/picpic/raw/master/img/%E8%B5%9A%E9%92%B1.png"
    let img = images.captureScreen();
    sleep(1200)
    var get_earnCoin = images.load(earnCoin);
    var find_earnCoin = findImage(img, get_earnCoin, {
        threshold: 0.6
    });
    if (find_earnCoin) {
        toastLog("页面正确");
        click(find_earnCoin.x + get_earnCoin.getWidth() / 2, find_earnCoin.y + get_earnCoin.getHeight() / 2)
        sleep(800)
        enterTask();
    } else {
        toastLog("未在指定界面");
        back();
        sleep(1500)
        task();
    }
};
// 赚金币
function enterTask(){
    let img = images.captureScreen();
        sleep(1200)
        var earnGold = "https://gitee.com/Kirk678/picpic/raw/master/img/%E8%B5%9A%E9%87%91%E5%B8%81.png"
        var get_earnGold = images.load(earnGold);
        var find_earnGold = findImage(img, get_earnGold, {
            threshold: 0.6
        });
        if (find_earnGold) {
            click(find_earnGold.x + get_earnGold.getWidth() / 2, find_earnGold.y + get_earnGold.getHeight() / 2)
            toastLog("任务列表存在")
        } else {
            toastLog("没找到");
            stopApp();
            sleep(1500)
            task();
        }
};
//找任务按钮
function findTaskBtn(type) {
    var taskBtnGroup = text('去赚钱').untilFind();
    var btn;
    taskBtnGroup.forEach(function (item) {
        if (type == 1 && !item.parent().findByText('逛商品赚金币').empty) {
            btn = item;
        } else if (type == 2 && !item.parent().findByText('逛活动赚金币').empty) {
            btn = item;
        } else if (type == 3 && !item.parent().findByText('看视频赚金币').empty) {
            btn = item;
        }
    });
    return btn;
};
//循环滑动函数(活动|商品专用)
function mySwipe(num, time) {
    var xpi = device.width / 2;
    var ypi = device.height * 2 / 3;
    var ypi2 = 200;
    for (var i = 0; i <= num; i++) {
        swipe(xpi, ypi, xpi, ypi2, random(800, 1400));
        sleep(time);
    }

};
//循环滑动函数2(视频专用)
function mySwipe2(time) {
    var xpi = device.width / 2;
    var xpi2 = device.width * 4 / 3;
    var ypi = device.height * 2 / 3;
    var ypi2 = random(0, 250);
    swipe(xpi, ypi, xpi2, ypi2, random(800, 1400));
    sleep(time);
};
//看一次商品任务
function doShopTask() {
    toastLog(click("去赚钱", 0));
    sleep(random(3200, 3800));
    mySwipe(random(5, 6), random(800, 1400));
    back();
};
//看一次活动任务
function doActiveTask() {
    toastLog(click("去赚钱", 0));
    sleep(random(4200, 5800));
    mySwipe(random(6, 7), random(800, 1400));
    back();
};
//视频任务
function doVideoTask() {
    toastLog(click("去赚钱", 0));
    sleep(1500)
    var child = idEndsWith('ck').findOne();
    toastLog('识别文本：' + child.text());
    click(child.text(), 0);
    sleep(4000)
    //一次看20秒,循环上限为10*50=500次
    for (var i = 1; i < 400; i++) {
        toastLog("第" + i + "次滑动");
        sleep(200)
        mySwipe2(random(10200, 12200));
        if (id("task_float_rl_fengkong_goon").exists()) {
            log(id("task_float_rl_fengkong_goon").findOne().click());

        };
        if (isEnd()) {
            toastLog('识别到今日已完成，结束看视频：');
            break;
        };
        toastLog(">>检测正常<<")
    };
};
//判断今日已完成是否存在
function isEnd() {
    var isEnd = text('今日已完成').findOne(2000);
    if (isEnd) {
        return true;
    }
    return false;
};
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
