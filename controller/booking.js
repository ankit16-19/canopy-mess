const request = require('request');

module.exports = (post_data,callback) =>{
  var login =
  {
        url:'http://172.16.2.200:8080/rosei/Servlet/LoginServlet',
        form:
        {
                'un':post_data.un,
                'pw':post_data.pw,
                'mode':post_data.mode,
                'submit':'Login'
        },
        headers:
        {
        }
  }

  request.post(login,(error,response,html)=>{
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

                  monbf:post_data.monbf,
                  monlun:post_data.monlun,
                  mondin:post_data.mondin,
                  tuebf:post_data.tuebf,
                  tuelun:post_data.tuelun,
                  tuedin:post_data.tuedin,
                  wedbf:post_data.wedbf,
                  wedlun:post_data.wedlun,
                  weddin:post_data.weddin,
                  thubf:post_data.thubf,
                  thulun:post_data.thulun,
                  thudin:post_data.thudin,
                  fribf:post_data.fribf,
                  frilun:post_data.frilun,
                  fridin:post_data.fridin,
                  satbf:post_data.satbf,
                  satlun:post_data.satlun,
                  satdin:post_data.satdin,
                  sunbf:post_data.sunbf,
                  sunlun:post_data.sunlun,
                  sundin:post_data.sundin,

                  check:post_data.check
          },
          headers:
          {
            cookie:response.headers['set-cookie'][0].slice(0,43)
          }
    }

    request.post(issue,(err,res,ht)=>{
     callback("done")
    }
  })
};
