
    function dateSelect2($year,$month) {
        /****获取当前年份*/
        var nowYear = new Date().getFullYear();

        /**获取当前月**/
        var nowMonth = new Date().getMonth()+1;

        getYear2($year,nowYear);
        getMonth2($month,nowYear);


        /****当年失去焦点时****/
        $year.blur(function () {
            var slYear = $year.find("option:selected").val();
            getMonth2($month,slYear);
        });


    }

    /*获取年*/
    function getYear2($year,nowYear) {
        /*设置开始年份为1970年*/
        var yearHtml = "";
        for(var k = 1970;k <= nowYear;k++){
            yearHtml += "<option value='"+ k +"'>"+ k +"年</option>";
        }
        $year.html(yearHtml);
        $year.find("option[value='"+ nowYear +"']").prop("selected",true);

    }

    /*获取月份*/
    function getMonth2($month,Year) {
        var nowYear = new Date().getFullYear();
        var nowMonth = new Date().getMonth()+1;
        var monthHtml = "";
        /**如果年份是当前年份，则月份最多只能选择当前月份*/

        if(Year == nowYear){
            for(var k = 1;k <= nowMonth;k++){
                monthHtml += "<option value='"+ k +"'>"+ k +"月</option>";
            }
            $month.html(monthHtml);
            $month.find("option[value='"+ nowMonth +"']").prop("selected",true);
        }
        else{
            for(var k = 1;k <= 12;k++){
                monthHtml += "<option value='"+ k +"'>"+ k +"月</option>";
            }
            $month.html(monthHtml);
        }
    }


    function dateSelect($year,$month,$day){
        /****获取当前年份*/
        var nowYear = new Date().getFullYear();

        /**获取当前月**/
        var nowMonth = new Date().getMonth()+1;
        /**获取当前天**/
        var nowDay = new Date().getDate();

        getYear($year,nowYear);
        getMonth($month,$day,nowYear);
        getDay($day,nowYear,nowMonth);


        /****当年和月失去焦点时****/
        $year.blur(function () {
            var slYear = $year.find("option:selected").val();
            getMonth($month,$day,slYear);
            // getDay(slYear,1);
        });

        $month.blur(function () {
            var slYear = $year.find("option:selected").val();
            var slMonth = $month.find("option:selected").val();
            getDay($day,slYear,slMonth);
        });

    }
    /*获取年*/
    function getYear($year,nowYear) {
        /*设置开始年份为1970年*/
        var yearHtml = "";
        for(var k = 1970;k <= nowYear;k++){
            yearHtml += "<option value='"+ k +"'>"+ k +"年</option>";
        }
        $year.html(yearHtml);
        $year.find("option[value='"+ nowYear +"']").prop("selected",true);

    }

    /*获取月份*/
    function getMonth($month,$day,Year) {
        var nowYear = new Date().getFullYear();
        var nowMonth = new Date().getMonth()+1;
        var monthHtml = "";
        /**如果年份是当前年份，则月份最多只能选择当前月份*/

        if(Year == nowYear){
            for(var k = 1;k <= nowMonth;k++){
                monthHtml += "<option value='"+ k +"'>"+ k +"月</option>";
            }
            $month.html(monthHtml);
            $month.find("option[value='"+ nowMonth +"']").prop("selected",true);
        }
        else{
            for(var k = 1;k <= 12;k++){
                monthHtml += "<option value='"+ k +"'>"+ k +"月</option>";
            }
            $month.html(monthHtml);
        }
        var slMonth = $month.find("option:selected").val();
        getDay($day,Year,slMonth);
    }
    /***获取日**/
    function getDay($day,year,month) {
        /****获取当前年份*/
        var nowYear = new Date().getFullYear();

        /**获取当前月**/
        var nowMonth = new Date().getMonth()+1;
        var dayHtml = "";

        if(nowYear == year && nowMonth == month){
            var nowDay = new Date().getDate();

            for(var k = 1;k <= nowDay;k++){
                dayHtml += "<option value='"+ k +"'>"+ k +"日</option>";
            }
            $day.html(dayHtml);
            $day.find("option[value='"+ nowDay +"']").prop("selected",true);
        }
        else{
            month = parseInt(month,10);
            var temp = new Date(year,month,0);

            for(var k = 1;k <= temp.getDate();k++){
                dayHtml += "<option value='"+ k +"'>"+ k +"日</option>";
            }
            $day.html(dayHtml);

        }


    }

    /***限制文本输入**/
    (function($) {
        $.fn.limitTextarea = function(opts) {
            var defaults = {
                maxNumber: 200, //允许输入的最大字数
                position: 'top', //提示文字的位置，top：文本框上方，bottom：文本框下方
                onOk: function() {}, //输入后，字数未超出时调用的函数
                onOver: function() {} //输入后，字数超出时调用的函数
            }
            var option = $.extend(defaults, opts);
            this.each(function() {
                var _this = $(this);

                /* var info = '<div id="info">还可以输入<b>' + (option.maxNumber - _this.val().length) + '</b>字</div>';*/
                var fn = function() {
                    /*var $info = $('#info');*/
                    var extraNumber = option.maxNumber - _this.val().length;

                    if (extraNumber >= 0) {
                        $(".hasPut" + $(this).attr('hasType')).text(_this.val().length);
                        /*    $info.html('还可以输入<b>' + extraNumber + '</b>个字');*/
                        option.onOk(_this);
                    } else {
                        /*  $info.html('已经超出<b style="color:red;">' + (-extraNumber) + '</b>个字');*/
                        option.onOver(_this);
                    }
                };
                switch (option.position) {
                    case 'top':
                        /*     _this.before(info);*/
                        break;
                    case 'bottom':
                    default:
                    /*  _this.after(info);*/
                }
                //绑定输入事件监听器
                if (window.addEventListener) { //先执行W3C
                    _this.get(0).addEventListener("input", fn, false);
                } else {
                    _this.get(0).attachEvent("onpropertychange", fn);
                }
                if (window.VBArray && window.addEventListener) { //IE9
                    _this.get(0).attachEvent("onkeydown", function() {
                        var key = window.event.keyCode;
                        (key == 8 || key == 46) && fn(); //处理回退与删除
                    });
                    _this.get(0).attachEvent("oncut", fn); //处理粘贴
                }
            });
        }
    })(jQuery)