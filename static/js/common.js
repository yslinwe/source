var aseKey = "CJAVAPmXucAksWmF"     //秘钥必须为：8/16/32位
function encryptMsg(message)
{
    //加密
    var encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
    }).toString();
    return (encrypt);    //VKrZlqykem73x8/T2oCfCQ==
}
function decryptMsg(encrypt)
{
    //解密
    decData = CryptoJS.enc.Base64.parse(encrypt).toString(CryptoJS.enc.Utf8);
    var decrypt = CryptoJS.AES.decrypt(decData, CryptoJS.enc.Utf8.parse(aseKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return (decrypt);    //80018000142
}
function getUUID() {
     
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
function makeData(msg)
{
    msg["t"] = Date.now()/1000;
    msg["deviceId"] = getUUID()
    msg["sign"] = msg["t"].toString()+":"+msg["deviceId"].toString()
    return {"msg":encryptMsg(JSON.stringify(msg))}
}
function receviceData(data)
{   
    return data
}