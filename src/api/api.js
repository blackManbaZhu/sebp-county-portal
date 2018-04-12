import axios from 'axios';

let base = '';

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
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;;
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
        var myreg = /^[A-Za-z0-9\u4e00-\u9fa5\_|\-|]+$/;
        if (!myreg.test(name)) {
            flag = false;
        } else {
            flag = true;
        }
        return flag;
    }
}