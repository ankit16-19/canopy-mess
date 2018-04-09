const request = require('request');
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');

module.exports = (post_data, callback) => {

    var pass;

    if(post_data.pass == 'encrypt'){
        var  decryptedString = cryptr.decrypt(post_data.pw);
        pass = decryptedString;
    }else{
        pass = post_data.pw
    }
  var login =
  {
        url:'http://172.16.2.200:8080/rosei/Servlet/LoginServlet',
        form:{
                'un':post_data.un,
                'pw':pass,
                'mode':post_data.mode,
                'submit':'Login'
        },
        headers:
        {
        }
  };

  request.post(login, (error,response,html)=>{
      var userloggedconsumer = {
          url:'http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp',
          headers:{
              cookie:response.headers['set-cookie'][0].slice(0,43),
              referer:"http://172.16.2.200:8080/rosei/login.jsp"
          }
      };
      request.get(userloggedconsumer, function (e1,r1,h1) {
      //callback(h);
      var selectmess = {
          url:'http://172.16.2.200:8080/rosei/selectmess.jsp',
          headers:{
              cookie:response.headers['set-cookie'][0].slice(0,43),
              referer:"http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp"
          }
          }
          request.get(selectmess, function (e2,r2,h2) {
              //callback(h2)
              var issuecoupan = {
                  url:'http://172.16.2.200:8080/rosei/issuecoupon.jsp?mess=m00' + post_data.check,
                  headers:{
                      cookie:response.headers['set-cookie'][0].slice(0,43),
                      referer:"http://172.16.2.200:8080/rosei/selectmess.jsp"
                  }
              }
              request.get(issuecoupan, function (e3, r3, h3) {
                  //callback(r3)
                  var issue =
                      {
                          url:'http://172.16.2.200:8080/rosei/Servlet/ControllerIssueCoupon',
                          form:
                              {
                                  un:post_data.un,
                                  pw:post_data.pw,

                                  monbfmt:post_data.monbfmt,
                                  monlunmt:post_data.monlunmt,
                                  mondinmt:post_data.mondinmt,
                                  tuebfmt:post_data.tuebfmt,
                                  tuelunmt:post_data.tuelunmt,
                                  tuedinmt:post_data.tuedinmt,
                                  wedbfmt:post_data.wedbfmt,
                                  wedlunmt:post_data.wedlunmt,
                                  weddinmt:post_data.weddinmt,
                                  thubfmt:post_data.thubfmt,
                                  thulunmt:post_data.thulunmt,
                                  thudinmt:post_data.thudinmt,
                                  fribfmt:post_data.fribfmt,
                                  frilunmt:post_data.frilunmt,
                                  fridinmt:post_data.fridinmt,
                                  satbfmt:post_data.satbfmt,
                                  satlunmt:post_data.satlunmt,
                                  satdinmt:post_data.satdinmt,
                                  sunbfmt:post_data.sunbfmt,
                                  sunlunmt:post_data.sunlunmt,
                                  sundinmt:post_data.sundinmt,
                                  check:post_data.check
                              },
                          headers:
                              {
                                  cookie: response.headers['set-cookie'][0].slice(0,43),
                                  referer:"http://172.16.2.200:8080/rosei/issuecoupon.jsp?mess=m00" + post_data.check,
                                  'Content-Type': "application/x-www-form-urlencoded"
                              }
                      }
                  var days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                  var times = ['bf', 'lun', 'din'];
                  for (var i in days){
                      for (var j in times){
                          if(post_data[days[i]+ times[j]] != 1){
                              var entity  = days[i]+ times[j];
                              issue['form'][entity] = post_data[entity]
                          }
                      }
                  }
                  console.log(issue);
                  request.post(issue, function (ef,rf,hf) {

                      console.log(rf.headers['location'])
                      var process = {
                          url:'http://172.16.2.200:8080/rosei/processingissuecoupon.jsp',
                          headers:{
                              cookie:response.headers['set-cookie'][0].slice(0,43),
                              referer:"http://172.16.2.200:8080/rosei/Servlet/ControllerIssueCoupon"
                          }
                      }
                      request.get(process, function (ef1, rf1, hf1) {
                          console.log(rf1.request['href'])
                          var confirm = {
                              url:'http://172.16.2.200:8080/rosei/confirmedbooking.jsp',
                              headers:{
                                  cookie:response.headers['set-cookie'][0].slice(0,43),
                                  referer:"http://172.16.2.200:8080/rosei/processingissuecoupon.jsp"
                              }
                          }
                          request.get(confirm, function (ef2, rf2, hf2) {
                              callback(rf2)
                          })
                      })

                  })
              })
          })
      })



   //  request.post(issue, (err,res,ht)=> {
   //   callback(res);
   // })
  })
};
