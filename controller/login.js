const request = require('request');
const cheerio = require('cheerio');

module.exports = (post_data,callback) => {
  var option =
  {
        url:'http://172.16.2.200:8080/rosei/Servlet/LoginServlet',
        form:
        {
                un:post_data.un,
                pw:post_data.pw,
                mode:post_data.mode,
                submit:'Login'
        },
        headers:
        {
        }
  }
  var data = {
    mess1:[],
    mess2:[],
  };

        request.post(option, (error, response, body) =>{
          if (!error) {
            // if no error
            var location = response.headers['location']
            if (location == "http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp") {
              // user successfuly logged-in
              if (post_data.mode == 'test') {
                // testmode //success
                data = {
                  result:"success"
                }

                callback(data)
              } else {
                // login
                var getfood = {
                  url:'http://172.16.2.200:8080/rosei/userLoggedconsumer.jsp',
                  headers:
                  {
                    cookie:response.headers['set-cookie'][0].slice(0,43)
                  }
                }
                var i;
                request.get(getfood,(err,res,bdy) =>{
                  var $ = cheerio.load(bdy);
                  i = 0
                  $('#table1 table').find('tr').filter(function(){

                    if(i>=1){
                      var day = $(this).find('th').text();
                      var brkfast = $(this).find('td').eq(0).text();
                      var lnch = $(this).find('td').eq(1).text();
                      var dinnr = $(this).find('td').eq(2).text();
                      data.mess1.push({
                        'day':day,
                        'brkfast':brkfast,
                        'lnch':lnch,
                        'dinnr':dinnr
                      })
                      i++;
                    }else{
                      i++
                    }
                  })
                   i = 0
                  $('#table2 table').find('tr').filter(function(){
                    if(i>=1){
                      var day = $(this).find('th').text();
                      var brkfast = $(this).find('td').eq(0).text();
                      var lnch = $(this).find('td').eq(1).text();
                      var dinnr = $(this).find('td').eq(2).text();
                      data.mess2.push({
                        'day':day,
                        'brkfast':brkfast,
                        'lnch':lnch,
                        'dinnr':dinnr
                      })
                      i++;
                    }else{
                      i++
                    }
                  })
                  data.amount1 = $('#cash > p:nth-child(2)').text().replace("ROSEIGHARA-1","").replace("Due Amount","").replace(/\n/g,"");
                  data.amount2 = $('#cash > p:nth-child(4)').text().replace("ROSEIGHARA-2","").replace("Due Amount","").replace(/\n/g,"");
                  data.total =$('#cash > p:nth-child(6)').text().replace("Total","").replace(/\n/g,"").replace(" ","");
                  callback(data)
                })

              }

            } else {
              // http://172.16.2.200:8080/rosei/invalidUser.jsp //invalidUser
              if (post_data.mode =="test") {
                // test mode //failed

                data = {
                  result:"failed"
                }
                callback(data)
              } else {
                data = {
                  result:"failed"
                }
                callback(data)
              }

            }
          } else {
            // if error

          }

          // callback(data);
        })

};
