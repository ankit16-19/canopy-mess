const request = require('request');
const cheerio = require('cheerio');
const Cryptr = require('cryptr'), cryptr = new Cryptr('myTotalySecretKey');

module.exports = function (post_data,callback) {

    var pass;
    if(post_data.pass === 'encrypt'){
        pass = cryptr.decrypt(post_data.pw);
    }else{
        pass = post_data.pw;
    }

    var login = {
        url:'http://172.16.2.200:8080/rosei/Servlet/LoginServlet',
        form:{
            un:post_data.un,
            pw:pass,
            mess:post_data.mess,
            submit:'Login'
        },
        headers:
            {

            }
    };

    var data = {
        messStatus:[],
        extraData:[]
    };

    request.post(login,function (error, response, html) {
        if(!error){
            // sucessgul login
            var location = response.headers['location'];
            if (location === "http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp") {
                //login successful
                var selectMess = {
                    url:"http://172.16.2.200:8080/rosei/selectmess.jsp",
                    headers: {
                        cookie: response.headers['set-cookie'][0].slice(0, 43),
                        referer: "http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp"
                    }
                }
                request.get(selectMess, function (err, resMess, htmlMess) {

                    var coupanStatus = {
                        url:'http://172.16.2.200:8080/rosei/issuecoupon.jsp?mess=' + post_data.mess,
                        headers:{
                            cookie:response.headers['set-cookie'][0].slice(0,43),
                            referer:"http://172.16.2.200:8080/rosei/selectmess.jsp"
                        }
                    };
                    request.get(coupanStatus, function (err, res, body) {
                        if(!err){
                            var $ = cheerio.load(body);
                            var i = 0;
                            $('table').eq(0).find('tr').filter( function () {
                                if(i === 0 || i === 9){
                                    i++;
                                }else{
                                    console.log($(this).html());
                                    var date = $(this).find('th').text().replace(/\n/g,"").replace(/\t/g,"").replace(" ","");
                                    var value = $(this).find('td').find('input').attr('value');
                                    data.extraData.push({
                                        "date":date,
                                        "value":value
                                    })
                                }
                                i++;
                            });
                            var i = 0;
                            $('table').eq(1).find('tr').filter( function () {


                                if(i === 0 || i === 8){
                                    i++
                                }else{
                                    var breakfast = $(this).find('td').eq(0).text().replace(/\n/g,"").replace(/\t/g,"").replace(" ","");
                                    var lunch = $(this).find('td').eq(1).text().replace(/\n/g,"").replace(/\t/g,"").replace(" ","");
                                    var dinner = $(this).find('td').eq(2).text().replace(/\n/g,"").replace(/\t/g,"").replace(" ","");
                                    var selectMess = post_data.mess;
                                    data.messStatus.push({
                                        'breakfast':breakfast,
                                        'lunch':lunch,
                                        'dinner':dinner
                                    })
                                    i++;
                                }

                            });

                            callback((data));

                        }else throw err;
                    })
                })
            }else{

                callback("loginFailed")
            }






        }else{
            console.log(error);
        }
    })
};