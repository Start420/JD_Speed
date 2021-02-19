setScreenMetrics(1080, 2248);
console.show()
var width = device.width
var height = device.height
var 仓库名 = "JD_Speed"     //需要更换仓库名
var 脚本文件夹 = "/sdcard/" + 仓库名 + "/" + 仓库名 + "-main"
//请求截图
if (!requestScreenCapture()) {
    toastLog("请求截图失败");
    exit();
};
main();
function main() {
    task();
    //判断任务是否需要执行
    toastLog("判断任务是否需要执行")
    var btn;
    var i = 1;
    while (btn = findTaskBtn(1)) {
        doShopTask(btn);
        toastLog('第' + i + '次看商品完成');
        if (++i > 100) {
            break;
        }
    }
    toastLog('商品任务结束');
    i = 1;
    while (btn = findTaskBtn(2)) {
        doActiveTask(btn);
        toastLog('第' + i + '次看活动完成');
        if (++i > 30) {
            break;
        }
    }
    toastLog('活动任务结束');
    if (btn = findTaskBtn(3)) {
        toastLog('正在执行看视频任务');
        doVideoTask(btn);
    }
    toastLog('视频任务结束');
    sleep(1500)
    back();
    console.timeEnd("耗时")
    exit();

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
function mySwipe(num,time) {
    var xpi = device.width / 2;
    var ypi = device.height * 2 / 3;
    var ypi2 = 200;
    for(var i=0;i<=num;i++) {
        swipe(xpi, ypi, xpi, ypi2, random(800, 1400 ));
        sleep(time);
    }
    
};
//循环滑动函数2(视频专用)
function mySwipe2(time) {
    var xpi = device.width / 2;
    var xpi2 = device.width * 4 / 3;
    var ypi = device.height * 2 / 3;
    var ypi2 = random(0,250);
    swipe(xpi, ypi, xpi2, ypi2, random(800, 1400 ));
    sleep(time);
};
//看一次商品任务
function doShopTask(shopBtn) {
    shopBtn.click();
    sleep(random(3200 , 3800 ));
    mySwipe(random(5,6),random(800, 1400 ));
    back();
    sleep(random(800, 1200 ));
    swipe(800,200,800,1600,random(300,540));
};
//看一次活动任务
function doActiveTask(activeBtn) {
    activeBtn.click();
    sleep(random(4200, 5800 ));
    mySwipe(random(6,7),random( 800, 1400 ));
    back();
    sleep(random(800, 1200 ));
    swipe(800,200,800,1600,random(300,540));
};
function doVideoTask(videoBtn) {
    videoBtn.click();
    sleep(1500)
    var child = idEndsWith('ck').findOne();
            toastLog('识别文本：'+child.text());
            click(child.text(),0);
            //一次看20秒,循环上限为10*50=500次
            for(var i=1; i< 400; i++) {
                toastLog("第"+i+"次滑动");
                sleep(200)
                mySwipe2(random(18200, 22200 ));
                if(id("task_float_rl_fengkong_goon").exists())
                {
                    log(id("task_float_rl_fengkong_goon").findOne().click());
                    
                };
                if (videoIsEnd()) {
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
