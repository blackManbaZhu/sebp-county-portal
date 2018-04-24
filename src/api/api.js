import axios from 'axios';

let base = '';

export const API = http_config.url;

export const tokenMessage = "您已在别处登录或用户被停用、删除、token失效，请您重新登录！";

export const Transaction = currentTime => {

    //uuid
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
  
    //日期时间
    let date = new Date();
    var currentTime = date.getFullYear() + '-' + (date.getMonth() + 1)+ '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  
    // return currentTime + uuid;
    return uuid;
}

//获取token
let token       = localStorage.getItem('token');

//获取ip
let XClientIP   = returnCitySN["cip"];

//获取用户ID
let userId      = localStorage.getItem('userId');

//获取机构ID
let orgId       = localStorage.getItem('orgId');

let transaction = Transaction();

export const Headers = {
    "X-Transaction": transaction,
    "X-User-Token": token,
};

export const UserHeader = {
    "X-UserId": userId,
    "X-User-OrgId": orgId,
    "X-User-Token": token,
};


export const requestTableList = params => { return axios.post(`${base}/ms/table/list`, params).then(res => res.data); }

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };


export const getTime = params => {
    var date = new Date(params);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var MM = M < 10 ? '0' + M : M;
    var dd = D < 10 ? '0' + D : D;
    var hh = h < 10 ? '0' + h : h;
    var mm = m < 10 ? '0' + m : m;
    var ss = s < 10 ? '0' + s : s;
    return Y + MM + dd + hh + ':' + mm + ':' + ss;
}
export const getHMStime = params => {
    var d = new Date(params);  
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var hh = h < 10 ? '0'+ h : h;
    var mm = m < 10 ? '0'+ m : m;
    var ss = s < 10 ? '0'+ s : s;
    return hh + ':' + mm + ':' + ss;
}

//去前后空格
export const trim = str => { //删除左右两端的空格
    if(str == null) {
        str = ''
    }else {
        str = str +'';
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//去掉所有空格
export const allSrim = str => {
    if(str == null) {
        str = ''
    }
    return str.replace(/\s/g, "")
}

//表单校验
export const verify = {
    phoneVerify(number) {
        var flag;
        if (number == null) {
            number = ''
        }
        var num = trim(number);
        var myreg = /^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(num) && num != '') {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    userNameVerify(name) {
        var flag;
        if (name == null) {
            name = ''
        }
        var num = trim(name);
        var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if (!myreg.test(num)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    ukSnVerufy(number) {
        var flag;
        var num;
        if (number == null) {
            number = ''
        }
        var num = trim(number);
        var myreg = /^[a-zA-Z0-9]{6,20}$/;
        if (!myreg.test(num)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    emailVerify(number) {
        var flag;
        if(number == null){
            number = ''
        }
        var num = trim(number);
        var myreg = /^([a-zA-Z0-9]*[-_.])*[a-zA-Z0-9]+[-_.]*@([a-zA-Z0-9]*[-_.])*[a-zA-Z0-9]+[-_]*\.[a-zA-Z]{2,3}$/;
        if (!myreg.test(num)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    passwordVerify(number){
        var flag;
        var myreg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@!*])(?=.*[-_@!*])[A-Za-z\d-_@!*]{6,20}$/;
        if (!myreg.test(number)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    mediaVerify(name) {
        var flag;
        if (name == null) {
            name = ''
        }
        var num = trim(name);
        var myreg = /^[A-Za-z0-9\u4e00-\u9fa5\_|\-|]{1,64}$/;
        if (!myreg.test(num)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    FMverify(number) {
        var flag;
        if (number == null) {
            number = ''
        }
        var num = trim(number);
        var myreg = /^([0-9]{2,3})+(\.[0-9]{1})+$/;
        if (!myreg.test(num)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    }
}