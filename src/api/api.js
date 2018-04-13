import axios from 'axios';
let base = '';
export const API = `https://60.174.223.96:18300`;


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
  
    return currentTime + uuid;
}
//获取ip
export const XClientIP = returnCitySN["cip"];
//获取token
export const token =  sessionStorage.getItem('token');

export const requestTableList = params => { return axios.post(`${base}/ms/table/list`, params).then(res => res.data); }

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const verify = {
    phoneVerify(number) {
        var flag;
        var myreg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(number) && number != '') {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    userNameVerify(name) {
        var flag;
        var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
        if (!myreg.test(name)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    ukSnVerufy(number) {
        var flag;
        var myreg = /^[a-zA-Z0-9]{6,20}$/;
        if (!myreg.test(number)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    emailVerify(number) {
        var flag;
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!myreg.test(number)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    passwordVerify(number){
        var flag;
        var myreg = new RegExp(`^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[-_@!*].*).(?=.*[-_@!*].*).([A-Z]|[a-z]|[0-9]|[-_@!*]){5,19}$`);
        if (!myreg.test(number)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    mediaVerify(name) {
        var flag;
        var myreg = /^[A-Za-z0-9\u4e00-\u9fa5\_|\-\.|]+$/;
        if (!myreg.test(name)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    },
    FMverify(number) {
        var flag;
        var myreg = /^([0-9]{2,3})+(\.[0-9]{1})+$/;
        if(number == 76 || number == 108){
            myreg = /^([0-9]{2,3})+$/;
        }
        if (!myreg.test(number)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    }
}