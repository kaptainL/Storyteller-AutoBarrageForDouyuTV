// ==UserScript==
// @icon          https://www.douyu.com/favicon.ico
// @name          复读机自动弹幕发射器
// @namespace     https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @author        闪光魔法师
// @description   适配斗鱼直播平台的自动弹幕发射器 随机复制复读机 Github:https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV
// @match         *://www.douyu.com/*
// @version       0.0.3
// @grant         none
// ==/UserScript==
(function () {
    'use strict';

    let tip = false;
    let div1 = document.createElement('div');//默认悬浮窗
    let div2 = document.createElement('div');//控制台
    let css1 = 'background: #FFB5C5;color:#ffffff;overflow: hidden;z-index: 998;position: fixed;padding:5px;text-align:center;width: 85px;height: 22px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 72%;'
    let css2 = 'background: #E5E4E4;color:#ffffff;overflow: hidden;z-index: 999;position: fixed;padding:5px;text-align:center;width: 100px;height: 90px;border-color: #FFFFFF;border: 3px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;right: 10px;top: 72%;display: none;';
    let cycle_time;//弹幕周期，单位毫秒 建议设定至6000毫秒以上 过低有系统屏蔽风险
    let _cycle_time = 1000;//弹幕div定时器
    let sentence;//复制的弹幕
    let interval;//发射定时器
    let danmu_interval;//等待弹幕div加载定时器
    let _ready = false;//弹幕div加载标记
    let div_manmu;//网页弹幕div
    let div_wenzi;//网页聊天室div
    let _mode = false;//套娃模式标记
    let __mode = false;//复读白字标记

    init();//初始化

//核心功能函数
    function init() {
        div1.id = 'DuLunChe2';
        div1.id = 'DuLunChe3';
        div1.style.cssText = css1;
        div2.style.cssText = css2;
        div1.innerHTML = '复读机控制台';
        div2.innerHTML = '<input type="text" style="width: 80px" placeholder="间隔时间(ms)" id="DuLunCheTime1"/><button id="DuLunCheBtn1" style="background-color: #FFFFFF;">出动！</button><br><button id="DuLunCheYinCang1" style="background-color: #FFFFFF;">隐藏控制台</button><div style="font-size: 75%;color: black;float: left;">套娃模式：<input type="checkbox" id="dlc_btn99" value="0" /><br>不复读白字：<input type="checkbox" id="dlc_btn98" value="0" /></div>';
        div1.onclick = () => {
            div2.style.setProperty('display','block');
            if(!tip){
                tip = true;
                alert('本插件由斗鱼用户重载操作符制作，项目地址：https://github.com/zhenshiluosuo/Storyteller-AutoBarrageForDouyuTV/ 有问题请私信斗鱼重载操作符，为了自己的账号和他人观看体验，建议发言间隔调至8000以上，喜欢的好兄弟github打个星星吧~求求了！！！');
            }
        };
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        document.getElementById('DuLunCheYinCang1').onclick = () => {
            div2.style.setProperty('display','none');
        };
        document.getElementById('DuLunCheBtn1').onclick = () => {
            if(document.getElementById('DuLunCheBtn1').innerText === '出动！') run();
            else finish();
        };
        document.getElementById('dlc_btn99').onclick = () => {
            if(document.getElementById('dlc_btn99').checked){
                _mode = true;
            }else{
                _mode = false;
            }
        };
        document.getElementById('dlc_btn98').onclick = () => {
            if(document.getElementById('dlc_btn99').checked){
                __mode = true;
            }else{
                __mode = false;
            }
        };
        danmu_interval = setInterval(() => {
            if(document.getElementsByClassName('danmu-6e95c1')[0].childNodes.length){
                div_manmu = document.getElementsByClassName('danmu-6e95c1')[0];
                div_wenzi = document.getElementById('js-barrage-list');
                div_manmu.addEventListener('DOMNodeInserted', function () {
                    if(_mode){
                        if(__mode && 'Barrage-content' === div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-content')[0].className){
                            return;
                        }
                        sentence = '@' + div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-nickName')[0].innerText + div_wenzi.childNodes[div_wenzi.childNodes.length - 1].getElementsByClassName('Barrage-content')[0].innerText;
                        _ready = true;

                    }else{
                        let len = div_manmu.childNodes.length;
                        if(len){
                            let _temp = div_manmu.childNodes[Math.floor((Math.random() * len))];
                            sentence = _temp.innerText;
                            let _color = _temp.style.color;
                            if(!__mode || (__mode && _color.length)){
                                _ready = true;
                            }
                        }
                    }
                },false);
                clearInterval(danmu_interval);
            }
        }, _cycle_time);
    }
//发射弹幕
    function run() {
        let btn = document.getElementsByClassName('ChatSend-button')[0];
        let txt = document.getElementsByClassName('ChatSend-txt')[0];
        document.getElementById('DuLunCheBtn1').innerText = '中止';
        cycle_time = parseInt(document.getElementById('DuLunCheTime1').value);
        if(cycle_time <= 2999) {
            alert('请珍惜账号 加大发言间隔！');
            finish();
            document.getElementById('DuLunCheTime1').value = '9999';
            return;
        }
        interval = setInterval(() => {
            if(txt.value === '' && _ready && btn.innerHTML === '发送'){//输入框中有内容时等待用户发送完成后再继续
                txt.value = sentence;
                btn.click();
                _ready = false;
            }
        }, cycle_time);
    }
//结束发射
    function finish() {
        document.getElementById('DuLunCheBtn1').innerText = '出动！';
        clearInterval(interval);
    }
})();